import { NextFunction, Request, Response } from "express";
import Subject from "../../database/subjects";
import { APIError } from "../../errors/types";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try{
        const subject = await Subject.findById(id)
        if(!subject) throw new APIError("Subject not found", 404);
        
        await subject.delete()
        
        res.json({
            message: "Subject deleted"  
        })
    }catch(err){
        res.locals.error = err;
        next()
    }
}