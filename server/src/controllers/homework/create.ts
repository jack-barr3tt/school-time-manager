import { NextFunction, Request, Response } from "express";
import Homework from "../../database/homework";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const homeworkItem = new Homework({
            ...req.body,
            user_id: req.params.userId
        })

        await homeworkItem.save();

        res.status(201).json(homeworkItem)
    }catch(err){
        res.locals.error = err;
        next()
    }
}