console.log("Starting up...")

import express, { json, NextFunction, Request, Response, Router, urlencoded } from 'express';
const server = express()
server.use(urlencoded({ extended: false }));
server.use(json());

server.use((req: Request, _res, next: NextFunction) => {
    console.log(req.method + " " + req.url)
    next()
})

// Route imports
import users from "./routes/users"
import blocks from './routes/blocks';
import locations from './routes/locations';

const user_router = Router({ mergeParams: true })
user_router.use('/locations', locations)
user_router.use('/blocks', blocks)

// Routes
const router = Router({ mergeParams: true })
router.use('/users/:userId/', user_router)
router.use('/users', users)

server.use(router)

// Error imports
import sql from './errors/sql';
import api from './errors/api';

// Error routes
server.use(sql)
server.use(api)

server.listen(3000, () => {
    console.log("Listening on port 3000")
})