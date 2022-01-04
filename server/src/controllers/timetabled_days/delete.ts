import { NextFunction, Request, Response } from "express";
import { TimetabledDays } from "../../database/timetabled_days";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try{
        const timetabledDay = await TimetabledDays.findById(id)
        if(!timetabledDay) return res.status(404).send({message: "Timetabled day not found"})

        await timetabledDay.delete()

        res.json({
            message: "Timetabled day deleted"
        })
    }catch(err){
        res.locals.error = err;
        next(err);
    }
};