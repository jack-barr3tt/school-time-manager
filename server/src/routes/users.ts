import { Router } from "express";

const router = Router()

// User route imports
import create from "../controllers/users/create";
import _delete from "../controllers/users/delete";
import edit from "../controllers/users/edit";
import get from "../controllers/users/get";

// User routes
router.post('/', create)
router.get('/:id', get)
router.patch('/:id', edit)
router.delete('/:id', _delete)

export default router