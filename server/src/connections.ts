import { config } from "dotenv";
import { Pool } from "pg";
config();

const Database = new Pool()

Database.connect(async () => {
    console.log("Connected to Database")
})

export default Database