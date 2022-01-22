import { Router } from "express";
import create from "../controllers/lesson/create";
import _delete from "../controllers/lesson/delete";
import edit from "../controllers/lesson/edit";
import get from "../controllers/lesson/get";
import getByUser from "../controllers/lesson/getByUser";

const router = Router({ mergeParams: true })

router.post('/', create)
router.get('/:id', get)
router.get('/', getByUser)
router.patch('/:id', edit)
router.delete('/:id', _delete)

export default router