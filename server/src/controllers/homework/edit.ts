import { NextFunction, Request, Response } from "express";
import Homework from "../../database/homework";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    try{
        const homework = await Homework.findById(id)
        if (!homework) throw new APIError("Homework not found", 404);

        let { task, subject_id, due, difficulty } = req.body

        if(task) homework.task = task
        if(subject_id) homework.subject_id = subject_id
        if(due) homework.due = due
        if(difficulty) homework.difficulty = difficulty

        await homework.save()

        res.json(homework)
    }catch(err){
        res.locals.error = err
        next()
    }
}