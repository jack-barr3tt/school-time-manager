import { NextFunction, Request, Response } from "express";
import { Lesson } from "../../database/lesson";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { id, userId } = req.params
    try{
        const lesson = await Lesson.findById(id, userId)
        if(!lesson) throw new APIError("Lesson not found", 404)

        res.json(lesson)
    }catch(err){
        res.locals.error = err
        next()
    }
}