import { NextFunction, Request, Response } from "express";
// import Activity from "../../database/activities";

export default async (req: Request, res: Response, next: NextFunction) => {
    //const { userId } = req.params
    try{
        // const activities = await Activity.findByUser(userId)

        // res.json(activities)

        res.json({
            message: "Not implemented yet"
        })
    }catch(err){
        res.locals.error = err
        next()
    }
}