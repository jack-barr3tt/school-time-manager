import { NextFunction, Request, Response } from "express";
import { LessonBlock } from "../../database/lesson_block";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId, id } = req.params;
    try{
        const block = await LessonBlock.findById(id, userId);
        if(!block) throw new APIError("Block not found", 404);

        let { name, start_time, end_time } = req.body
        if(name) block.name = name
        if(start_time) block.start_time = start_time;
        if(end_time) block.end_time = end_time;

        await block.save();
        res.json(block)
    }catch(err){
        res.locals.error = err;
        next()
    }
}