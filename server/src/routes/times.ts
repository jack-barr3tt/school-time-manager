import { Router } from "express";
import create from "../controllers/working_times/create";
import _delete from "../controllers/working_times/delete";
import get from "../controllers/working_times/get";
import getByUser from "../controllers/working_times/getByUser";
import edit from "../controllers/working_times/edit"

const router = Router({ mergeParams: true })

router.post('/', create)
router.get('/:id', get)
router.get('/', getByUser)
router.patch('/:id', edit)
router.delete('/:id', _delete)

export default router