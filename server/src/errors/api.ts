import { NextFunction, Request, Response } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
    if(res.locals.error)
    if(res.locals.error.code)

    if(res.locals.error.code > 0 && res.locals.error.code < 600)
        return res.status(res.locals.error.code).json({
            message: res.locals.error.message || "An error occurred",
        })
    next()
};