import { NextFunction, Request, Response } from "express";
import Subject from "../../database/subjects";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subject = new Subject({
            ...req.body,
            user_id: req.params.userId
        });

        await subject.save();
        
        res.status(201).json(subject);
    }catch(err) {
        res.locals.error = err;
        next();
    }
}