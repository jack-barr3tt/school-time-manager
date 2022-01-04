import { NextFunction, Request, Response } from "express";
import { Teacher } from "../../database/teacher";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const teacher = new Teacher({
            ...req.body,
            user_id: req.params.userId
        })
        
        await teacher.save()

        res.status(201).json(teacher)
    }catch(err){
        res.locals.error = err
        next()
    }
}