import { NextFunction, Request, Response } from "express";
import { Repeat } from "../../database/repeats";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const repeat = new Repeat({
            ...req.body,
            user_id: req.params.userId
        })

        await repeat.save()

        res.status(201).json(repeat)
    }catch(err){
        res.locals.error = err
        next()
    }
}