import { Router } from "express";
import get from "../controllers/schedule/get";

const router = Router({ mergeParams: true })

router.get('/', get)

export default router