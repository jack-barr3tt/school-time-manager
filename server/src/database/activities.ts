import Database from "../connections";
import Homework from "./homework";
import { add, compareAsc, differenceInDays, differenceInMinutes, eachDayOfInterval, intervalToDuration, isFuture, isSameDay, startOfDay } from "date-fns";
import { WorkingTime } from "./working_times";

class AssignmentList {
    private data: { data: Activity, next: number, prev: number, index: number }[];
    private nextIndex: number = 0;
    private count;

    constructor(data: Activity[]) {
        this.data = data.map((d,i) => ({ data: d, next: i+1, prev: i-1, index: i }));
        this.count = this.data.length;
    }

    toArray () {
        return this.data.filter(d => this.data[d.next] && this.data[d.next].prev === d.index).map(d => d.data);
    }

    remove(id: number) {
        const index = this.data.findIndex(d => d.data.id === id);
        if (index === -1) {
            return;
        }
        let nextIndex = this.data[index].next;
        let prevIndex = this.data[index].prev;
        
        if(this.data[nextIndex]) this.data[nextIndex].prev = prevIndex;
        if(this.data[prevIndex]) this.data[prevIndex].next = nextIndex;

        this.count -= 1;
    }

    rewind() {
        if(this.count > 0) {
            this.nextIndex = this.data.findIndex((d,i) => d.prev === -1 && this.data[d.next] && this.data[d.next].prev === i);
        }
    }

    next() {
        if(this.count < 1) return null

        const next = this.data[this.nextIndex];
        if(!next) return null;

        this.nextIndex = next.next;

        return next.data;
    }

    filter(fn: (data: Activity) => boolean) {
        return this.data.filter((d, i) => fn(d.data) && this.data[d.next] && this.data[d.next].prev === i).map(d => d.data);
    }
}

class TaskList {
    private data: { data: Activity, next: number }[];
    private nextIndex: number = 0;

    public get length() {
        return this.data.length
    }

    constructor(data: Activity[]) {
        this.data = data.map((d,i) => ({ data: d, next: i+1 }));
        console.table(this.data.slice().map((d,i) => ({
            index: i,
            subject: d.data.homework.subject_id,
            next: d.next
        })).sort((a,b) => a.next === -1 ? 1 : a.next - b.next))
    }

    shuffle() {
        let last = 0;
        let visited: number[] = []
        while(true) {
            if(!this.data[last]) break;

            let loopback = -1

            for(let i = 0; i < this.data.length; i++) {
                if(!visited.includes(i)) {
                    loopback = i
                    if(this.data[i].data.homework.subject_id === this.data[last].data.homework.subject_id) {
                        break
                    }
                }
            }

            if(loopback == -1) {
                this.data[last].next = loopback
                break
            }

            let found = false

            for(let i = 0; i < this.data.length; i++) {
                if(!visited.includes(i) && i != loopback) {
                    if(this.data[i].data.homework.subject_id != this.data[last].data.homework.subject_id) {
                        this.data[last].next = i
                        this.data[i].next = loopback
                        visited.push(i)
                        found = true
                        break;
                    }
                }
            }

            if(!found) {
                this.data[last].next = loopback
            }
            visited.push(last)
            last = loopback
        }
        console.table(this.data.slice().map((d,i) => ({
            index: i,
            subject: d.data.homework.subject_id,
            next: d.next
        })).sort((a,b) => a.next === -1 ? 1 : a.next - b.next))
    }

    next() {
        let currentItem = this.data[this.nextIndex]
        if(!currentItem) return null;
        this.nextIndex = currentItem.next
        return currentItem.data
    }

    rewind() {
        this.nextIndex = 0
    }
}

type ActivityArgs = Activity & {
    homework_task: string;
    homework_due: number;
    homework_duration: number;
    homework_complete: boolean;
    subject_id: number,
    subject_name: string, 
    subject_color: number,
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
    
    readonly user_id: number;
    public homework: Homework;
    public duration: number;
    public index: number;

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
        this.duration = data.duration
        this.index = data.index
    }

    private static DurationToBlocks(duration: number) {
        return [
            ...Array(Math.floor(duration / 30)).fill(30),
            duration % 30 === 0 ? 30 : duration % 30
        ]
    }

    private static createActivities(userId: string, homework_id: number, duration: number) {
        const blocks = Activity.DurationToBlocks(duration)

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
        while(true) {
            const ops: Promise<any>[] = []

            const { rows: activityRows } = await Database.query(
                `SELECT a.*, h.task homework_task, h.due homework_due, h.duration homework_duration, h.complete homework_complete, s.id subject_id, s.name subject_name, s.color subject_color
                FROM activities a
                INNER JOIN homeworks h ON a.homework_id = h.id
                INNER JOIN subjects s ON h.subject_id = s.id 
                WHERE a.user_id = $1`,
                [userId]
            )

            const allActivities = activityRows.map(a => new Activity(a))

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
                        let tempBlocks = Activity.DurationToBlocks(homework.duration)

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

            if(ops.length > 0) {
                await Promise.all(ops)
            }else{
                return allActivities
            }
        }
    }

    static async findByUser(userId: string) {
        const homeworks = await Homework.getByUser(userId)
        const sortedHomeworks = homeworks.filter(h => h.due != null && h.duration != null).filter(h => isFuture(h.due || 0)).sort((a,b) => compareAsc(a.due || 0, b.due || 0))

        const activities = await Activity.MatchActivities(userId, sortedHomeworks)
        // const sortedActivities = activities.sort((a,b) => compareAsc(a.homework.due || 0, b.homework.due || 0))

        const workingTimes = await WorkingTime.findByUser(userId)
        
        homeworks.forEach(h => {
            const activity = activities.filter(a => a.homework_id === h.id)
            console.log(h.id,"has",activity.length,"activities")
        })

        const lastHomework = sortedHomeworks[sortedHomeworks.length - 1]
        const allDaysNeeded = eachDayOfInterval({
            start: new Date(),
            end: lastHomework.due || 0
        })
        const allWorkingTimes = allDaysNeeded.map(day => 
            workingTimes.map(w => { 
                return {
                    id: w.id!,
                    start_time: add(startOfDay(day), intervalToDuration({ start: 0, end: (w.start_time - startOfDay(w.start_time).getTime()) })),
                    end_time: add(startOfDay(day), intervalToDuration({ start: 0, end: (w.end_time - startOfDay(w.end_time).getTime()) }))
                }
            })
        )

        const tasksToAssign = new AssignmentList(activities)

        const assignedTasks : { day: Date, activities: Activity[] }[] = []
        
        for(let day of allDaysNeeded) {
            tasksToAssign.rewind()

            let toDoToday = tasksToAssign.filter(a => isSameDay(a.homework.due || 0, add(day, { days: 1})))

            toDoToday.forEach(a => { if(a.id) tasksToAssign.remove(a.id) })

            const timeNeeded = (activities: Activity[]) => activities.reduce((a, b) => a + b.duration + 5, 0)
            const timeAvailable = (workingTimes: { id: number, start_time: Date, end_time: Date }[][]) => workingTimes.filter(w => w.some(t => isSameDay(t.start_time, day))).reduce((a, b) => a + b.reduce((c, d) => c + differenceInMinutes(d.end_time, d.start_time) ,0), 0)

            let tempAssigns = new TaskList(tasksToAssign.toArray())
            tempAssigns.shuffle()

            while(true) {
                const nextToAssign = tempAssigns.next()

                if(!nextToAssign) break
                if(!nextToAssign.id) break

                if(timeNeeded([nextToAssign, ...toDoToday]) > timeAvailable(allWorkingTimes)) break
                toDoToday.push(nextToAssign)
                tasksToAssign.remove(nextToAssign.id)
            }

            let additions = 0

            console.log("\n",day)

            console.log("tasks before additions",toDoToday.length)

            for(let homework of homeworks) {
                const homeworkActivities = new AssignmentList(tasksToAssign.filter(a => a.homework_id === homework.id))
                const timeRemaining = timeNeeded(homeworkActivities.toArray())
                if(timeRemaining <= 0) continue
                const daysRemaining = differenceInDays(homework.due || 0, day)

                // console.log("\nhomework", homework.task)
                // console.log("amount of work left to do: ", timeRemaining)
                // console.log("days left to do it in: ", daysRemaining)
                // console.log("required average work:", timeRemaining / daysRemaining)
                // console.log("actual work being done:", toDoToday.filter(a => a.homework.id === homework.id).reduce((a, b) => a + b.duration, 0))

                while(toDoToday.filter(a => a.homework.id === homework.id).reduce((a, b) => a + b.duration, 0) < timeRemaining / daysRemaining) {
                    let next = homeworkActivities.next()
                    if(!next) break
                    if(!next.id) break
                    toDoToday.push(next)
                    tasksToAssign.remove(next.id)
                    additions++
                }

                // console.log("actual work being done after additions:", toDoToday.filter(a => a.homework.id === homework.id).reduce((a, b) => a + b.duration, 0))
            }

            console.log("added", additions, "activities")

            console.log("tasks after additions",toDoToday.length)
            
            const tasks = new TaskList(toDoToday)
            console.log("task list contains", tasks.length, "tasks")

            tasks.shuffle()

            let temp : Activity[] = []

            while(true) {
                let next = tasks.next()
                console.log(next?.id)
                if(!next) break
                if(!next.id) break
                temp.push(next)
            }
            console.log("final task list for the day contains", temp.length, "tasks")
            if(temp.length > 0) assignedTasks.push({ day, activities: temp })
        }

        console.table(assignedTasks.map(d => ({
            day: d.day,
            tasks: d.activities.map(a => a.homework.id).join(", ")
        })))
    }
}
