import { add, compareAsc, isFuture } from "date-fns";
import { NextFunction, Request, Response } from "express";
import { Lesson } from "../../database/lesson";
import { Repeat } from "../../database/repeats";
import { User } from "../../database/users";
import { APIError } from "../../errors/types";
import { GetWeek, LessonsInWeeks, MergeSort, RepeatsToWeeks, TransposeLessonBlock } from "../../functions";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { userId } = req.params
        const subjectId = req.query.subjectId ? +req.query.subjectId : undefined

        const [lessons, user, repeats] = await Promise.all([
            Lesson.findByUser(userId),
            User.findById(userId),
            Repeat.findByUser(userId)
        ])
        if(!user) throw new APIError("User not found", 404)

        const repeatRef = user.repeat_ref ? new Date(user.repeat_ref) : undefined
        if(!repeatRef || !user.repeat_id) return

        // Splits repeats across the required number of weeks for them all to take place
        const weeks = RepeatsToWeeks(repeats)
        // Maps all the lessons onto the repeats we have just split up
        const lessonsInWeek = LessonsInWeeks(lessons, weeks)

        if(subjectId) {
            // If a subject ID is provided we want the next lesson with this subject ID

            // Loop over each week to check for the lesson
            for(let i = 0; i < weeks.length; i++) {
                // Each week will take place 1 extra week in the future so we add this number of weeks
                const date = add(repeatRef, { weeks: i })
                // Gets all lessons in the week we are currently considering
                const thisWeek = GetWeek(
                        lessonsInWeek, 
                        date, 
                        user.repeat_id
                    )
                    /* 
                    We want to modify lessons so that their block start and end times align with the
                    day that they are going to occur on
                    */
                    .lessons.map(l => ({
                        ...l,
                        block: TransposeLessonBlock(
                                l.block,
                                add(date, { days: l.day - date.getDay() + 1 })
                            )
                    }))
                // Finally we sort lessons by the time they will occur
                const sortedWeek = MergeSort(thisWeek, (a, b) => compareAsc(a.block.start_time, b.block.start_time))

                /*
                The next lesson, if it exists, will be the first with a matching subject ID
                that occurs in the future
                */
                const nextLesson = sortedWeek.find(l => l.subject.id === subjectId && isFuture(l.block.start_time))
                if(nextLesson) return res.json(nextLesson)
            }
        } else {
            // If no subject ID is provided we want the next lesson happening today
            
            const date = repeatRef || new Date()

            // Get all lessons in the week we are currently considering
            const { lessons: lessonsThisWeek } = GetWeek(
                lessonsInWeek,
                date,
                user.repeat_id
            )

            // Get all lessons happening today in order
            const lessonsToday = MergeSort(
                lessonsThisWeek?.filter(l => l.day === new Date().getDay() - 1),
                (a, b) => compareAsc(a.block.start_time, b.block.start_time)
            )
            // Then modify so that block start and end times align with the day that they are going to occur on
            .map(l => ({
                ...l,
                block: TransposeLessonBlock(
                        l.block,
                        add(date, { days: l.day - date.getDay() + 1 })
                    )
            }))

            // The next lesson will be the first lesson whose lesson block starts in the future
            const nextLesson = lessonsToday?.find(l => isFuture(l.block.start_time))

            res.json(nextLesson)
        }
    }catch(err){
        res.locals.error = err;
        next();
    }
};