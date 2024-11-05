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
    }
    };
    // I am creating a new connection pool with the specified configuration
    const pool: Pool = createPool(connectionConfig);
    return pool;
};





export {  createConnection };
