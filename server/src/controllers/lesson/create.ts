import { NextFunction, Request, Response } from "express";
import { Lesson } from "../../database/lesson";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const lesson = new Lesson({
            ...req.body,
            user_id: req.params.userId
        })

        await lesson.save()

        res.status(201).json(lesson)
    }catch(err){
        res.locals.error = err
        next()
    } 
}