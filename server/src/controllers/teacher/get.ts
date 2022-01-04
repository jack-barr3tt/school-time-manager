import { NextFunction, Request, Response } from "express";
import { Teacher } from "../../database/teacher";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    try{
        const teacher = await Teacher.findById(id)
        if(!teacher) throw new APIError("Teacher not found", 404)

        res.json(teacher)
    }catch(err){
        res.locals.error = err
        next()
    }
}