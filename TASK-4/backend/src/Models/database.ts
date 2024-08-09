import { createPool, Pool } from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config({ path: '././config.env' });

// Create a connection pool to the MySQL database for default use
const insertInfo: Pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

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

// Test the default database connection
const testConnection = async (): Promise<void> => {
    insertInfo.query('SELECT 1')
        .then((rows) => {
            // I am logging a success message if the connection to the database is successful
            console.log('Connected to the database successfully:', rows[0]);
        })
        .catch(err => {
            // I am catching and logging any errors that occur during the connection
            const error = err as Error;
            console.error('Error connecting to the database:', error.message);
            console.error('Stack Trace:', error.stack);
        });
};

// I am running the test connection function to check the default database connection
testConnection();

export { insertInfo, createConnection };
