import { NextFunction, Request, Response } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.json({
            message: "Not implemented yet"
        })
    }catch(err){
        res.locals.error = err
        next()
    }
}