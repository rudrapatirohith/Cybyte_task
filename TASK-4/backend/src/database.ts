import { createPool } from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config({path: './config.env'});


// Create a connection pool to the MySQL database
   const insertInfo = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test the database connection
const testConnection = async () => {
  try {
      const [rows] = await insertInfo.query('SELECT 1');
      console.log('Connected to the database successfully:', rows);
  } catch (err) {
      console.error('Error connecting to the database:', err);
  }
};

testConnection();

export default insertInfo;