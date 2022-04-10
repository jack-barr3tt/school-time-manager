import { NextFunction, Request, Response } from "express";
import Homework from "../../database/homework";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const homework = new Homework({
            ...req.body,
            user_id: req.params.userId,
            complete: false
        })

        await homework.save()

        res.status(201).json(homework)
    }catch(err){
        res.locals.error = err
        next()
    }
}