import { Request, Response, NextFunction } from "express";
import { WorkingTime } from "../../database/working_times";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { id, userId } = req.params;
    try{
        const time = await WorkingTime.findById(id, userId)
        if(!time) throw new APIError("Working time not found", 404)

        res.json(time)
    }catch(err){
        res.locals.error = err
        next()
    }
}