import { compareAsc, isFuture } from "date-fns";
import { NextFunction, Request, Response } from "express";
import { Lesson } from "../../database/lesson";
import { LessonBlock } from "../../database/lesson_block";
import { User } from "../../database/users";
import { APIError } from "../../errors/types";
import { TransposeLessonBlock } from "../../functions";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { userId } = req.params
        const subjectId = req.query.subjectId ? +req.query.subjectId : undefined

        const [lessons, lessonBlocks, user] = await Promise.all([
            Lesson.findByUser(userId),
            LessonBlock.findByUser(userId),
            User.findById(userId)
        ])
        if(!user) throw new APIError("User not found", 404)

        const repeatRef = user.repeat_ref ? new Date(user.repeat_ref) : undefined

        console.log(repeatRef)

        const lessonsWithBlocks = lessons.map(l => ({
            ...l,
            block: TransposeLessonBlock(l.block)
        }))

        // Get all lessons happening today
        const lessonsToday = lessons?.filter(l => l.day === new Date().getDay() - 1)
        // Get all lesson blocks occuring today
        const lessonBlocksToday = lessonBlocks.map(b => TransposeLessonBlock(b))
        if(subjectId) {
            const thisSubject = lessonsWithBlocks.filter(l => l.subject.id === subjectId && isFuture(l.block.start_time))

            res.json(thisSubject[0])
        } else {
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