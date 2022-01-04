import { NextFunction, Request, Response } from "express";
import { Repeat } from "../../database/repeats";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try{
        const repeat = await Repeat.findById(id);
        if(!repeat) throw new APIError("Repeat not found", 404);

        repeat.delete();

        res.json({
            message: "Repeat deleted"
        })
    }catch(err){
        res.locals.error = err;
        next()
    }
}