import { NextFunction, Request, Response } from "express";
import { Repeat } from "../../database/repeats";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { userId } = req.params

        const repeats = await Repeat.findByUser(userId)

        res.json(repeats)
    }catch(err){
        res.locals.error = err
        next(err)
    }
}