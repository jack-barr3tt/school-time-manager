import { NextFunction, Request, Response } from "express";
import { WorkingTime } from "../../database/working_times";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId, id } = req.params
    try{
        const time = await WorkingTime.findById(id, userId)
        if(!time) throw new APIError("Working time not found", 404)

        const { start_time, end_time } = req.body
        if(start_time) time.start_time = start_time
        if(end_time) time.end_time = end_time

        await time.save()
        res.json(time)
    }catch(err){
        res.locals.error = err
        next()
    }
}