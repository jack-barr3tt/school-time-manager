import { Router } from "express";
import create from "../controllers/location/create";
import _delete from "../controllers/location/delete";
import edit from "../controllers/location/edit";
import get from "../controllers/location/get";
import getByUser from "../controllers/location/getByUser";

const router = Router({ mergeParams: true })

router.post('/', create)
router.get('/', getByUser)
router.get('/:id', get)
router.patch('/:id', edit)
router.delete('/:id', _delete)

export default router