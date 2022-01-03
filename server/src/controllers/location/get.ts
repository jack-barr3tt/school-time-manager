import { NextFunction, Request, Response } from "express"
import { Location } from "../../database/location"
import { APIError } from "../../errors/types"

export default async (req: Request, res: Response, next: NextFunction) => {
  const { id, userId } = req.params
  try {
      const location = await Location.findById(id, userId)
      if(!location) throw new APIError("Location not found", 404)

      res.json(location)
  } catch (err) {
      res.locals.error = err
      next()
  }
}
