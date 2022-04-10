import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const { authorization } = req.headers
    if(!authorization){
        return res.status(401).json({
            message: "No authorization token"
        })
    }
    try{
        // Token should be provided in format "Bearer <token>" so we split it by " " and take the second part
        const token = authorization.split(" ")[1]
        const decoded = verify(token, process.env.JWT_SECRET || "") as { userId: number }

        // If the user id in the token doesn't match the user id in the url, we return an error
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
}