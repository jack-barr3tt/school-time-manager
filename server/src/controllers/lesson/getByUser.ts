import { NextFunction, Request, Response } from "express";
import { Lesson } from "../../database/lesson";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    try{
        const lessons = await Lesson.findByUser(userId)

        res.json(lessons)
    }catch(err){
        res.locals.error = err
        next()
    }
}