import { Router } from "express";
import create from "../controllers/repeats/create";
import _delete from "../controllers/repeats/delete";
import edit from "../controllers/repeats/edit";
import get from "../controllers/repeats/get";
import getByUser from "../controllers/repeats/getByUser";

const router = Router({ mergeParams: true })

router.post('/', create)
router.get('/:id', get)
router.get('/', getByUser)
router.patch('/:id', edit)
router.delete('/:id', _delete)

export default router