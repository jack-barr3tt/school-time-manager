import { NextFunction, Request, Response } from "express";
import Homework from "../../database/homework";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId, id } = req.params
    try{
        const homework = await Homework.findById(id, userId)
        if (!homework) throw new APIError("Homework not found", 404)

        const { task, subject_id, due, duration, complete } = req.body

        if(task) homework.task = task
        if(subject_id) homework.subject_id = subject_id
        if(due) homework.due = due
        if(duration) homework.duration = duration
        if(complete) homework.complete = complete

        await homework.save()

        res.json(homework)
    }catch(err){
        res.locals.error = err
        next()
    }
}