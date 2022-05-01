import { add, compareAsc, isFuture } from "date-fns";
import { NextFunction, Request, Response } from "express";
import { Lesson } from "../../database/lesson";
import { LessonBlock } from "../../database/lesson_block";
import { Repeat } from "../../database/repeats";
import { User } from "../../database/users";
import { APIError } from "../../errors/types";
import { GetWeek, LessonsInWeeks, RepeatsToWeeks, TransposeLessonBlock } from "../../functions";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { userId } = req.params
        const subjectId = req.query.subjectId ? +req.query.subjectId : undefined

        const [lessons, lessonBlocks, user, repeats] = await Promise.all([
            Lesson.findByUser(userId),
            LessonBlock.findByUser(userId),
            User.findById(userId),
            Repeat.findByUser(userId)
        ])
        if(!user) throw new APIError("User not found", 404)

        const repeatRef = user.repeat_ref ? new Date(user.repeat_ref) : undefined

        const weeks = RepeatsToWeeks(repeats)
        const lessonsInWeek = LessonsInWeeks(lessons, weeks)

        if(subjectId) {
            if(!repeatRef || !user.repeat_id) return
            for(let i = 0; i < weeks.length; i++) {
                const date = add(repeatRef || new Date(), { weeks: i })
                const thisWeek = GetWeek(
                        lessonsInWeek, 
                        date, 
                        user.repeat_id
                    ).lessons.map(l => ({
                        ...l,
                        block: TransposeLessonBlock(
                                l.block,
                                add(date, { days: l.day - date.getDay() + 1 })
                            )
                    }))
                    .sort((a, b) => compareAsc(a.block.start_time, b.block.start_time))

                const nextLesson = thisWeek.find(l => l.subject.id === subjectId && isFuture(l.block.start_time))
                if(nextLesson) return res.json(nextLesson || {})
            }
        } else {
            // Get all lessons happening today
            const lessonsToday = lessons?.filter(l => l.day === new Date().getDay() - 1)
            // Get all lesson blocks occuring today
            const lessonBlocksToday = lessonBlocks.map(b => TransposeLessonBlock(b))
            // Get all remaining lesson blocks and sort them from soonest to latest
            const lessonBlocksLeft = lessonBlocksToday.filter(b => isFuture(b.start_time)).sort(
                (a,b) => compareAsc(a.start_time, b.start_time)
            )
            // The next lesson will be the one whose block id matches the id of the first item in lessonBlocksLeft
            const nextLesson = lessonsToday?.find(l => lessonBlocksLeft.some(b => b.id === l.block.id))

            res.json(nextLesson)
        }
    }catch(err){
        res.locals.error = err;
        next();
    }
};