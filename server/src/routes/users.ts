import { Router } from "express";

const router = Router()

// User route imports
import create from "../controllers/users/create";
import _delete from "../controllers/users/delete";
import get from "../controllers/users/get";

// User's blocks routes imports
import getByUser from "../controllers/lesson_block/getByUser";

// User routes
router.post('/', create)
router.get('/:id', get)
router.delete('/:id', _delete)

// User's blocks routes
router.get('/:userId/blocks', getByUser)

export default router