import { NextFunction, Request, Response } from "express";
import { TimetabledDays } from "../../database/timetabled_days";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try{
        const timetabledDay = await TimetabledDays.findById(id)
        if(!timetabledDay) throw new APIError("Timetabled day not found", 404);

        let { repeat_id, day } = req.body;

        if(repeat_id) timetabledDay.repeat_id = repeat_id;
        if(day) timetabledDay.day = day;

        await timetabledDay.save();
        res.json(timetabledDay);
    }catch(err){
        res.locals.error = err;
        next()
    }
}