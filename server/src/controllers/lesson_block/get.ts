import { Request, Response, NextFunction } from "express";
import { LessonBlock } from "../../database/lesson_block";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId, id } = req.params;
    try{
        const lesson_block = await LessonBlock.findById(id, userId)
        if(!lesson_block) throw new APIError("Lesson block not found", 404)

        res.json(lesson_block)
    }catch(err){
        res.locals.error = err
        next()
    }
}