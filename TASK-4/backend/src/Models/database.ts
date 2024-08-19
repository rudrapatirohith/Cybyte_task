import { createPool, Pool } from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config({ path: '././config.env' });


// Function to create a connection pool dynamically based on an ID
const createConnection = async (id: string): Promise<Pool> => {
    let connectionConfig = {};

    // I am setting up the connection configuration based on the provided ID
    if (id === '1') {
        connectionConfig = {
            host: process.env.DB01_HOST,
            port: parseInt(process.env.DB01_PORT || '3336'),
            user: process.env.DB01_USER,
            password: process.env.DB01_PASSWORD,
            database: process.env.DB01_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            connectTimeout: 10000
        };
    } else if (id === '2') {
        connectionConfig = {
            host: process.env.DB02_HOST,
            port: parseInt(process.env.DB02_PORT || '3336'),
            user: process.env.DB02_USER,
            password: process.env.DB02_PASSWORD,
            database: process.env.DB02_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            connectTimeout: 10000
        };
    } else {
        // I am throwing an error if the ID is invalid
        throw new Error('Invalid ID provided');
    }

    // I am creating a new connection pool with the specified configuration
    const pool: Pool = createPool(connectionConfig);
    return pool;
};








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




export {  createConnection,insertInfo };
