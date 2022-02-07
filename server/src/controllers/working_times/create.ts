import { NextFunction, Request, Response } from "express";
import { WorkingTime } from "../../database/working_times";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const time = new WorkingTime({
            ...req.body,
            user_id: req.params.userId,
        })
        await time.save()

        res.json(time)
    }catch(err){
        res.locals.error = err
        next()
    }
}