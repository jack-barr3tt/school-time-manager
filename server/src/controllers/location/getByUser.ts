import { NextFunction, Request, Response } from "express";
import { Location } from "../../database/location";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    try{
        const locations = await Location.findByUser(userId)

        res.json(locations);
    }catch(err){
        res.locals.error = err;
        next(err);
    }
};