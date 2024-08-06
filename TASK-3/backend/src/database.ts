import { createPool } from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config({path: './config.env'});

// Create a connection pool to the MySQL database
let loginData;
try{
   loginData = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
console.log('Database connections established successfully.');
}
catch (error) {
    console.error('Error establishing database connections:', error);
  }

export default loginData;