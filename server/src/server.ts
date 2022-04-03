console.log("Starting up...")

import express, { json, NextFunction, Request, Response, Router, urlencoded } from 'express';
import cors from 'cors';
import auth from './auth';

const server = express()
server.use(cors())  
server.use(urlencoded({ extended: false }));
server.use(json());

server.use((req: Request, _res, next: NextFunction) => {
    console.log(req.method + " " + req.url)
    next()
})

// Route imports
import users from "./routes/users"
import blocks from './routes/blocks';
import homework from './routes/homework';
import lessons from './routes/lessons';
import locations from './routes/locations';
import repeats from './routes/repeats';
import subjects from './routes/subjects';
import teachers from './routes/teachers';
import times from './routes/times';
import schedule from './routes/schedule';

const user_router = Router({ mergeParams: true })
user_router.use('/homework', homework)
user_router.use('/lessons', lessons)
user_router.use('/repeats', repeats)
user_router.use('/teachers', teachers)
user_router.use('/locations', locations)
user_router.use('/blocks', blocks)
user_router.use('/subjects', subjects)
user_router.use('/times', times)
user_router.use('/schedule', schedule)

// Routes
const router = Router({ mergeParams: true })
router.use('/users', users)
router.use('/users/:userId',auth)
router.use('/users/:userId/', user_router)

server.use(router)

// Error imports
import sql from './errors/sql';
import api from './errors/api';

// Error routes
server.use(sql)
server.use(api)
server.use((_req, res: Response, _next) => {
    res.status(404).json({
        message: "Not found"
    })
})

server.listen(3000, () => {
    console.log("Listening on port 3000")
})