import { NextFunction, Request, Response } from "express";
import Homework from "../../database/homework";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { userId } = req.params;
        const homework = await Homework.getByUser(userId);

        const sortedHomework = homework.sort((a, b) => (a.due || 0) - (b.due || 0))
        
        res.json(
            sortedHomework.find(h => !h.complete)
        );
    }catch(err){
        res.locals.error = err;
        next();
    }
};