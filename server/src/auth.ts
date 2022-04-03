import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { authorization } = req.headers
    if(!authorization){
        return res.status(401).json({
            message: "No authorization token"
        })
    }
    try{
        const decoded = verify(authorization.split(" ")[1], process.env.JWT_SECRET || "") as { userId: number }

        if(decoded.userId !== +userId) {
            return res.status(401).json({
                message: "Not authorized for this user"
            })
        }

        next()
    }catch{
        return res.status(401).json({
            message: "Invalid authorization token"
        })
    }
};