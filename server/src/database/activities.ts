import { isFuture, compareAsc, eachDayOfInterval, add, startOfDay, intervalToDuration, isSameDay } from "date-fns";
import Database from "../connections";
import { AssignmentList } from "../scheduling/AssignmentList";
import { ActivityData, DurationLength, DurationOfActivities, DurationToBlocks } from "../scheduling/DurationHelpers";
import { TaskList } from "../scheduling/TaskList";
import Homework from "./homework";
import { WorkingTime } from "./working_times";
import { AssignActivitiesToBlock, AssignActivitiesToShortBlocks } from "../scheduling/AssignmentHelpers";

type ActivityArgs = Activity & {
    homework_task: string;
    homework_due: number;
    homework_duration: number;
    homework_complete: boolean;
    subject_id: number,
    subject_name: string, 
    subject_color: number,
    wt_start_time: number,
    wt_end_time: number
}

export default class Activity {
    private _id?: number;
    public get id() {
        return this._id
    }
    private set id(newId: number|undefined) {
        this._id = newId
    }
    
    public get homework_id() {
        return this.homework.id
    }
    public set homework_id(newId: number|undefined) {
        this.homework = { id: newId } as Homework
    }

    public get working_time_id() {
        return this.working_time.id
    }
    public set working_time_id(newId: number|undefined) {
        this.working_time = { id: newId } as WorkingTime
    }
    
    readonly user_id: number;
    public homework: Homework;
    public working_time: WorkingTime;
    public time: number;
    public complete: boolean;
    public duration: number;

    constructor(data: ActivityArgs) {
        this.id = data.id
        this.user_id = +data.user_id
        this.homework = new Homework({
            id: data.homework_id,
            user_id: data.user_id,
            task: data.homework_task,
            subject_id: data.subject_id,
            subject_name: data.subject_name,
            subject_color: data.subject_color,
            due: data.homework_due,
            duration: data.homework_duration,
            complete: data.homework_complete
        } )
        this.working_time = new WorkingTime({
            id: data.working_time_id,
            user_id: data.user_id,
            start_time: data.wt_start_time,
            end_time: data.wt_end_time
        } as WorkingTime)
        this.time = data.time
        this.complete = data.complete || false
        this.duration = data.duration
    }

    private static createActivities(userId: string, homework_id: number, duration: number) {
        const blocks = DurationToBlocks(duration)

        return blocks.map(b => 
            Database.query(
                `INSERT INTO activities (user_id, homework_id, duration)
                VALUES ($1, $2, $3)`,
                [userId, homework_id, b]
            )
        )
    }

    private static deleteActivities(userId: string, ids: number[]) {
        return ids.map(id => 
            Database.query(
                `DELETE FROM activities
                WHERE id = $1 AND user_id = $2`,
                [id, userId]
            )
        )
    }
    
    static async MatchActivities(userId: string, homeworks: Homework[]) {
        let end = false
        while(true) {
            const ops: Promise<any>[] = []

            const { rows: activityRows } = await Database.query(
                `SELECT a.*, h.task homework_task, h.due homework_due, h.duration homework_duration, h.complete homework_complete, s.id subject_id, s.name subject_name, s.color subject_color, w.start_time wt_start_time, w.end_time wt_end_time
                FROM activities a
                INNER JOIN homeworks h ON a.homework_id = h.id
                INNER JOIN subjects s ON h.subject_id = s.id 
                LEFT JOIN working_times w ON a.working_time_id = w.id
                WHERE a.user_id = $1`,
                [userId]
            )

            const allActivities = activityRows.map(a => new Activity(a))

            if(end) {
                return allActivities
            }else{
                await Promise.all(ops)
            }

            const homeworkDeleted = allActivities.filter(a => !homeworks.find(h => h.id == a.homework_id))
            const homeworkCompleted = allActivities.filter(a => homeworks.find(h => h.id == a.homework_id)?.complete)

            Activity.deleteActivities(userId, homeworkDeleted.map(a => a.id || 0))
            Activity.deleteActivities(userId, homeworkCompleted.map(a => a.id || 0))

            for(let homework of homeworks) {
                if(!homework.due || !homework.duration || !homework.id) continue

                let activities = allActivities.filter(a => a.homework_id === homework.id)

                if(activities.length > 0) {
                    const acitivitySum = activities.reduce((a, b) => a + b.duration, 0)
                    const difference = homework.duration - acitivitySum

                    if(difference === 0) {
                        continue
                    } else if(difference > 0) {
                        if(activities.filter(a => a.duration < 30).length > 0) {
                            ops.push(
                                Database.query(
                                    `DELETE FROM activities WHERE homework_id = $1 AND duration < 30`,
                                    [homework.id]
                                )
                            )
                        } else {
                            ops.push(...Activity.createActivities(userId, homework.id, difference))
                        }
                    } else {
                        let tempActivities = activities
                        let tempBlocks = DurationToBlocks(homework.duration)

                        for(let block of tempBlocks) {
                            const firstMatch = tempActivities.find(a => a.duration === block)
                            if(firstMatch) tempActivities = tempActivities.filter(a => a._id !== firstMatch._id)
                        }

                        ops.push(...Activity.deleteActivities(userId, tempActivities.map(a => a._id || 0)))
                    }
                }else{
                    Activity.createActivities(userId, homework.id, homework.duration)
                }
            }

            if(ops.length < 1) end = true
        }
    }

    static async findByUser(userId: string) {
        const workingTimes = await WorkingTime.findByUser(userId)
        const homeworks = await Homework.getByUser(userId)
        
        const sortedHomeworks = homeworks.filter(h => h.due != null && h.duration != null).filter(h => isFuture(h.due || 0) && !h.complete).sort((a,b) => compareAsc(a.due || 0, b.due || 0))
        
        const activities = await Activity.MatchActivities(userId, sortedHomeworks)
        const activitiesToAssign = new AssignmentList<Activity>(activities)

        const lastHomework = sortedHomeworks[sortedHomeworks.length - 1]
        if(!lastHomework) return
        
        const allDaysNeeded = eachDayOfInterval({
            start: new Date(),
            end: lastHomework.due || 0
        })
        const allWorkingTimes = allDaysNeeded.map(day => ({
                day, 
                times: workingTimes.map(w => ({
                        id: w.id!,
                        start_time: add(startOfDay(day), intervalToDuration({ start: 0, end: (w.start_time - startOfDay(w.start_time).getTime()) })),
                        end_time: add(startOfDay(day), intervalToDuration({ start: 0, end: (w.end_time - startOfDay(w.end_time).getTime()) }))
                })
            ).filter(w => isFuture(w.start_time))
        }))

        const tasks = new TaskList()

        const lockActivities = (activityData: ActivityData[]) => {
            const activitiesToLock : Activity[] = []
            activityData.forEach(a => {
                let activity = activities.find(b => b.id === a.id)
                if(activity) {
                    activity.working_time_id = a.working_time_id
                    activitiesToLock.push(activity)
                }
            })
            if(activitiesToLock.length > 0) tasks.add(activitiesToLock)
            activitiesToAssign.remove(activityData.map(a => a.id || 0))
        }

        for(const {day, times} of allWorkingTimes) {
            // This needs to reduce as blocks are filled
            const timesToFill = times

            const activitesForTommorrow = () => activitiesToAssign.filter(a => isSameDay(a.homework.due || 0, add(day, { days: 1 })))
            
            const dueNextDay = AssignActivitiesToBlock(timesToFill, activitesForTommorrow())
            lockActivities(dueNextDay)
    
            const shortTimes = () => timesToFill.filter(t => DurationLength(t) < 30)
            
            const dueNextDayShort = AssignActivitiesToShortBlocks(shortTimes(), activitesForTommorrow()) 
            lockActivities(dueNextDayShort)

            if(DurationOfActivities(activitesForTommorrow()) > 0) {
                //need to use up some overflow time
            }else{
                const dueLater = AssignActivitiesToBlock(timesToFill, activitiesToAssign.toArray())
                lockActivities(dueLater)

                const dueLaterShort = AssignActivitiesToShortBlocks(shortTimes(), activitiesToAssign.toArray())
                lockActivities(dueLaterShort)
            }
        }

        tasks.shuffle()
        tasks.rewind()

        const test = []
        while(true) {
            const next = tasks.next()
            if(!next) break
            if(!next.id) break

            test.push(next)
        }

        console.table(test.map(t => ({
            ...t, homework: t.homework_id, time: t.working_time.id   
        })))
    }
}
