import { NextFunction, Request, Response } from "express";
import { Teacher } from "../../database/teacher";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { userId } = req.params

        const teachers = await Teacher.findByUser(userId)

        res.json(teachers)
    }catch(err){
        res.locals.error = err
        next(err)
    }
}