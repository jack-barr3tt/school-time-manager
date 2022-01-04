import { NextFunction, Request, Response } from "express";
import Subject from "../../database/subjects";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { userId } = req.params;

        const subjects = await Subject.findByUser(userId);

        res.json(subjects);
    }catch(err){
        res.locals.error = err;
        next(err);
    }
};