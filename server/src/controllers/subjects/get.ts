import { NextFunction, Request, Response } from "express";
import Subject from "../../database/subjects";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId, id } = req.params
    try {
        const subject = await Subject.findById(id, userId)
        if (!subject) throw new APIError("Subject not found", 404)

        res.json(subject)
    }catch(err) {
        res.locals.error = err
        next()
    }
}