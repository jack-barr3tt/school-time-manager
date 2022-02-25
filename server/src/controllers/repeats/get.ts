import { NextFunction, Request, Response } from "express";
import { Repeat } from "../../database/repeats";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId, id } = req.params
    try{
        const repeat = await Repeat.findById(id, userId)
        if(!repeat) throw new APIError("Repeat not found", 404)

        res.json(repeat)
    }catch(err){
        res.locals.error = err
        next()
    }
}