import { Location } from "../../database/location";
import { NextFunction, Request, Response } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const location = new Location({
            ...req.body,
            user_id: req.params.userId
        })
        await location.save()

        res.json(location)
    }catch(err){
        res.locals.error = err
        next()
    }
}