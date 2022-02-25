import { NextFunction, Request, Response } from "express";
import { Teacher } from "../../database/teacher";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { userId, id } = req.params;  
    try{
        const teacher = await Teacher.findById(id, userId)
        if(!teacher) throw new APIError("Teacher not found", 404);

        await teacher.delete()

        res.json({
            message: "Teacher deleted"
        })
    }catch(err){
        res.locals.error = err;
        next()
    }
}