import { config } from "dotenv";
import { Pool } from "pg";

// Gets the database config from the environment variables
config()

const Database = new Pool()

Database.connect(() => 
    console.log("Connected to Database")
)

export default Database