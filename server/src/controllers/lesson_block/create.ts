import { NextFunction, Request, Response } from "express";
import { WorkingTime } from "../../database/working_times";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const lesson_block = new WorkingTime({
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