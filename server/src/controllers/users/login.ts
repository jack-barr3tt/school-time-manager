import { NextFunction, Request, Response } from "express";
import { User } from "../../database/users";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { email, password } = req.body

        // Check if a user with the given email exists
        const user = await User.findByEmail(email)
        if(!user) return res.status(404).json({
            message: "User not found"
        })

        try{
            // If the password is correct, a token is returned
            const token = await user.verifyPassword(password)

            // Respond with the token and user ID
            res.json({
                token,
                id: user.id,
            })
        }catch(err){
            // If the password is incorrect, an error is thrown
            const error = err as APIError
            return res.status(401).json({
                message: error.message
            })
        }
    }catch(err){
        // All other errors are handled by the error handler
        res.locals.error = err
        next()
    }
}