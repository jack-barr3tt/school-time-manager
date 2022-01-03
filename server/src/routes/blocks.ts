import { Router } from "express";
import create from "../controllers/lesson_block/create";
import _delete from "../controllers/lesson_block/delete";
import edit from "../controllers/lesson_block/edit";
import get from "../controllers/lesson_block/get";
import getByUser from "../controllers/lesson_block/getByUser";

const router = Router({ mergeParams: true })

router.post('/', create)
router.get('/:id', get)
router.get('/', getByUser)
router.patch('/:id', edit)
router.delete('/:id', _delete)

export default router