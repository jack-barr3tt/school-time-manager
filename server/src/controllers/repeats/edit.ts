import { NextFunction, Request, Response } from "express";
import { Repeat } from "../../database/repeats";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try{
        const repeat = await Repeat.findById(id);
        if(!repeat) throw new APIError("Repeat not found", 404);

        let { name, start_day, end_day } = req.body;

        if(name) repeat.name = name;
        if(start_day) repeat.start_day = start_day;
        if(end_day) repeat.end_day = end_day;   

        await repeat.save();
        res.json(repeat)
    }catch(err){
        res.locals.error = err;
        next()
    }
}