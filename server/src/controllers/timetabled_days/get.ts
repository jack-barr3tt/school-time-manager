import { NextFunction, Request, Response } from "express";
import { TimetabledDays } from "../../database/timetabled_days";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    try{
        const timetabled_day = await TimetabledDays.findById(id)
        if(!timetabled_day) throw new APIError("Timetabled day not found", 404)

        res.json(timetabled_day)
    }catch(err){
        res.locals.error = err
        next()
    }
}