import { Router } from "express";
import create from "../controllers/teacher/create";
import _delete from "../controllers/teacher/delete";
import edit from "../controllers/teacher/edit";
import get from "../controllers/teacher/get";
import getByUser from "../controllers/teacher/getByUser";

const router = Router({ mergeParams: true })

router.post('/', create)
router.get('/:id', get)
router.get('/', getByUser)
router.patch('/:id', edit)
router.delete('/:id', _delete)

export default router