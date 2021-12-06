console.log("Starting up...")

import express, { json, NextFunction, Request, urlencoded } from 'express';
const server = express()
server.use(urlencoded({ extended: false }));
server.use(json());

server.use((req: Request, _res, next: NextFunction) => {
    console.log(req.method + " " + req.url)
    next()
})

// Error imports
import sql from './errors/sql';
import api from './errors/api';

// Error routes
server.use(sql)
server.use(api)

server.listen(3000, () => {
    console.log("Listening on port 3000")
})