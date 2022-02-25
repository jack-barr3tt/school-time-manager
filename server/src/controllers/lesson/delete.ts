import { NextFunction, Request, Response } from "express";
import { Lesson } from "../../database/lesson";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId, id } = req.params;
    try{
        const lesson = await Lesson.findById(id, userId);
        if(!lesson) throw new APIError("Lesson not found", 404);

        await lesson.delete()

        res.json({
            message: "Lesson deleted"
        })
    }catch(err){
        res.locals.error = err;
        next()
    }
}