import { Router } from "express";
import create from "../controllers/location/create";
import _delete from "../controllers/location/delete";
import get from "../controllers/location/get";
import getByUser from "../controllers/location/getByUser";

const router = Router({ mergeParams: true })

router.post('/', create)
router.get('/', getByUser)
router.get('/:id', get)
router.delete('/:id', _delete)

export default router