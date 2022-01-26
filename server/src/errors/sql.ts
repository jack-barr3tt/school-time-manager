import { NextFunction, Request, Response } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
    if(res.locals.error)
    if(res.locals.error.code) {
        if(res.locals.error.code > 0 && res.locals.error.code < 600) return next()

        if(res.locals.error.code == 23505) {
            console.log(res.locals.error)
            return res.status(400).json({
                message: res.locals.error.detail || "Duplicate key"
            })
        }else if(res.locals.error.code == 23502) {
            return res.status(400).json({
                message: `Column ${res.locals.error.column} cannot not be null`
            })
        }else{
            return res.status(500).json(res.locals.error);
        }
    }
    next()
}