import { NextFunction, Request, Response } from "express";
import { User } from "../../database/users";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const user = new User(req.body)

        await user.addPassword(req.body.password)

        await user.save()
        
        res.status(201).json({
            _id: user.id,
            email: user.email,
            username: user.username,
            repeat_ref: user.repeat_ref
        })
    }catch(err){
        res.locals.error = err
        next()
    }
}