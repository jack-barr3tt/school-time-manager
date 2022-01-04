import { NextFunction, Request, Response } from "express";
import { TimetabledDays } from "../../database/timetabled_days";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const timetabled_day = new TimetabledDays({
            ...req.body,
            user_id: req.params.userId
        })

        await timetabled_day.save()

        res.status(201).json(timetabled_day)
    }catch(err){
        res.locals.error = err
        next()
    }
}       