import { Router } from "express";
import create from "../controllers/homework/create";
import _delete from "../controllers/homework/delete";
import edit from "../controllers/homework/edit";
import get from "../controllers/homework/get";
import getByUser from "../controllers/homework/getByUser";

const router = Router({ mergeParams: true });

router.post('/', create)
router.get('/:id', get)
router.get('/', getByUser)
router.patch('/:id', edit)
router.delete('/:id', _delete)

export default router;