import { NextFunction, Request, Response } from "express";
import { LessonBlock } from "../../database/lesson_block";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    try{
        const lessonBlocks = await LessonBlock.findByUser(userId);
        
        res.json(lessonBlocks);
    }catch(err){
        res.locals.error = err;
        next(err);
    }
};