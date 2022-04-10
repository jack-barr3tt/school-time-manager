import { NextFunction, Request, Response } from "express";
import { WorkingTime } from "../../database/working_times";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    try{
        const times = await WorkingTime.findByUser(userId)
        
        res.json(times)
    }catch(err){
        res.locals.error = err
        next(err)
    }
}