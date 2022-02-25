import { NextFunction, Request, Response } from "express";
import { Location } from "../../database/location";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId, id } = req.params;
    try{
        const location = await Location.findById(id, userId)
        if(!location) throw new APIError("Location not found", 404);

        await location.delete();

        res.json({
            message: "Location deleted"
        })
    }catch(err){
        res.locals.error = err;
        next()
    }
}