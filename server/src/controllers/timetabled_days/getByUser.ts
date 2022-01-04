import { NextFunction, Request, Response } from "express";
import { TimetabledDays } from "../../database/timetabled_days";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { userId } = req.params

        const timetabledDays = await TimetabledDays.findByUser(userId)
        
        res.json(timetabledDays)
    }catch(err){
        res.locals.error = err;
        next(err);
    }
};