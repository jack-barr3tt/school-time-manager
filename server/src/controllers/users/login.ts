import { NextFunction, Request, Response } from "express";
import { User } from "../../database/users";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if(!user) return res.status(404).json({
            message: "User not found"
        })

        try{
            const token = await user.verifyPassword(password);

            res.json({
                token
            })
        }catch(err){
            const error = err as APIError
            return res.status(401).json({
                message: error.message
            })
        }
    }catch(err){
        res.locals.error = err;
        next();
    }
};