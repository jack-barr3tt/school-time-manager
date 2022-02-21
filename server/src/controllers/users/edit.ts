import { NextFunction, Request, Response } from "express";
import { User } from "../../database/users";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try{
        const user = await User.findById(id)
        if(!user) throw new APIError("User not found", 404);

        let { prewarning, repeat_ref, repeat_id } = req.body

        if(prewarning) user.prewarning = prewarning;
        if(repeat_ref) user.repeat_ref = repeat_ref
        if(repeat_id) user.repeat_id = repeat_id

        await user.save();

        res.json(user)
    }catch(err){
        res.locals.error = err;
        next(err);
    }
};