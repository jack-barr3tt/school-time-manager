import { Router } from "express";
import _delete from "../controllers/timetabled_days/delete";
import edit from "../controllers/timetabled_days/edit";
import create from "../controllers/timetabled_days/create";
import get from "../controllers/timetabled_days/get";
import getByUser from "../controllers/timetabled_days/getByUser";

const router = Router({ mergeParams: true })

router.post('/', create)
router.get('/:id', get)
router.get('/', getByUser)
router.patch('/:id', edit)
router.delete('/:id', _delete)

export default router