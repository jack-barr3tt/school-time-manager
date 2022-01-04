import { Router } from "express";
import create from "../controllers/subjects/create";
import _delete from "../controllers/subjects/delete";
import edit from "../controllers/subjects/edit";
import get from "../controllers/subjects/get";
import getByUser from "../controllers/subjects/getByUser";

const router = Router({ mergeParams: true })

router.post('/', create)
router.get('/:id', get)
router.get('/', getByUser)
router.patch('/:id', edit)
router.delete('/:id', _delete)

export default router