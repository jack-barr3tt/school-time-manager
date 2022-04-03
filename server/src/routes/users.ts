import { Router } from "express";
import auth from "../auth";

const router = Router()

// User route imports
import create from "../controllers/users/create";
import _delete from "../controllers/users/delete";
import edit from "../controllers/users/edit";
import get from "../controllers/users/get";
import login from "../controllers/users/login";

// User routes
router.post('/', create)
router.post('/login', login)
router.use('/:userId', auth)
router.get('/:id', get)
router.patch('/:id', edit)
router.delete('/:id', _delete)

export default router