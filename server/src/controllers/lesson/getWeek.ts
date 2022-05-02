import { NextFunction, Request, Response } from "express";
import { Lesson } from "../../database/lesson";
import { Repeat } from "../../database/repeats";
import { User } from "../../database/users";
import { APIError } from "../../errors/types";
import { GetWeek, LessonsInWeeks, RepeatsToWeeks } from "../../functions";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { userId } = req.params
        const [lessons, repeats, user] = await Promise.all([
            Lesson.findByUser(userId),
            Repeat.findByUser(userId),
            User.findById(userId)
        ])
        if(!user) throw new APIError("User not found", 404)

        const repeatRef = user.repeat_ref ? new Date(user.repeat_ref) : undefined
        if(!repeatRef || !user.repeat_id) throw new APIError("User has no repeat reference", 400)

        // Splits repeats across the required number of weeks for them all to take place
        const weeks = RepeatsToWeeks(repeats)
        // Maps all the lessons onto the repeats we have just split up
        const lessonsInWeek = LessonsInWeeks(lessons, weeks)

        // Gets all lessons in the current week
        const weekData = GetWeek(lessonsInWeek, repeatRef, user.repeat_id)
        res.json({
            ...weekData,
            repeats: weeks[weekData.no]
        })
    }catch(err){
        res.locals.error = err
        next()
    }
}