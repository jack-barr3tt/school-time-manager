import { NextFunction, Request, Response } from "express";
import { Lesson } from "../../database/lesson";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId, id } = req.params
    try{
        const lesson = await Lesson.findById(id, userId)
        if(!lesson) throw new APIError("Lesson not found", 404)

        const { subject_id, block_id, location_id, teacher_id, day, repeat_id } = req.body

        if(subject_id) lesson.subject_id = subject_id
        if(block_id) lesson.block_id = block_id
        if(location_id) lesson.location_id = location_id
        if(teacher_id) lesson.teacher_id = teacher_id
        if(day) lesson.day = day
        if(repeat_id) lesson.day = repeat_id

        await lesson.save()
        res.json(lesson)
    }catch(err){
        res.locals.error = err
        next()
    }
}