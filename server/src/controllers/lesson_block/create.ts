import { NextFunction, Request, Response } from "express";
import { LessonBlock } from "../../database/lesson_block";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const lesson_block = new LessonBlock({
            ...req.body,
            user_id: req.params.userId,
        })
        await lesson_block.save()

        res.json(lesson_block)
    }catch(err){
        res.locals.error = err
        next()
    }
}