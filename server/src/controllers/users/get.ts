import { NextFunction, Request, Response } from "express";
import { User } from "../../database/users";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    try{
        const user = await User.findById(id)
        if(!user) throw new APIError("User not found", 404)
        
        res.json(user)
    }catch(err) {
        res.locals.error = err
        next()
    }
}