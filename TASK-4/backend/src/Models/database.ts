import { createPool ,Pool} from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config({ path: '././config.env' });


// Create a connection pool to the MySQL database
const insertInfo: Pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});




// pool creation to do dynamic connection
const createConnection = async(id: string): Promise<Pool>=>{
    let connectionConfig={};

    if(id==='1'){
        connectionConfig={
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
    }
    else if(id==='2'){
        connectionConfig={
            host: process.env.DB02_HOST,
            port: parseInt(process.env.DB01_PORT || '3336'), 
            user: process.env.DB02_USER,
            password: process.env.DB02_PASSWORD,
            database: process.env.DB02_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            connectTimeout: 10000
        };
    }
    else{
        throw new Error('Invalid ID provided');
    }

    const pool: Pool = createPool(connectionConfig);
    return pool;
}





// Test the database connection
const testConnection = async (): Promise<void> => {
    try {
        const [rows] = await insertInfo.query('SELECT 1');
        console.log('Connected to the database successfully:', rows);
    } catch (err) {
        const error = err as Error;
        console.error('Error connecting to the database:', error.message);
        console.error('Stack Trace:', error.stack);
    }
};

testConnection();

export {insertInfo,createConnection};