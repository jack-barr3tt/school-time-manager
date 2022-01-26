import { NextFunction, Request, Response } from "express";
import Homework from "../../database/homework";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    try{
        const homework = await Homework.findById(id)
        if (!homework) throw new APIError("Homework not found", 404);

        res.json(homework)
    }catch(err){
        res.locals.error = err
        next()
    }
}