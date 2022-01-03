import { NextFunction, Request, Response } from "express";
import { LessonBlock } from "../../database/lesson_block";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { id, userId } = req.params;
    try{
        const block = await LessonBlock.findById(id, userId);
        if(!block) throw new Error("Lesson block not found");

        await block.delete();

        res.json({
            message: "Lesson block deleted"
        })
    }catch(err){
        res.locals.error = err;
        next()
    }
}