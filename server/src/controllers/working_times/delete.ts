import { NextFunction, Request, Response } from "express";
import { WorkingTime } from "../../database/working_times";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId, id } = req.params
    try{
        const time = await WorkingTime.findById(id, userId)
        if(!time) throw new Error("Working time not found")

        await time.delete()

        res.json({
            message: "Working time deleted"
        })
    }catch(err){
        res.locals.error = err
        next()
    }
}