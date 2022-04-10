import { NextFunction, Request, Response } from "express";
import Homework from "../../database/homework";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    try{
        const homeworks = await Homework.getByUser(userId)

        res.json(homeworks)
    }catch(err){
        res.locals.error = err
        next()
    }
}