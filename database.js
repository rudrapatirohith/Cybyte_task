import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' }); // Specify the path


let db1, db2, db3;

try {
  // Create a connection pool for the first database
  db1 = mysql.createPool({
    host: process.env.DB1_HOST,
    user: process.env.DB1_USER,
    password: process.env.DB1_PASSWORD,
    database: process.env.DB1_NAME
  });

  // Create a connection pool for the second database
  db2 = mysql.createPool({
    host: process.env.DB2_HOST,
    user: process.env.DB2_USER,
    password: process.env.DB2_PASSWORD,
    database: process.env.DB2_NAME
  });
 
  // Create a connection pool for the second database
  db3 = mysql.createPool({
    host: process.env.DB3_HOST,
    user: process.env.DB3_USER,
    password: process.env.DB3_PASSWORD,
    database: process.env.DB3_NAME
  });

  console.log('Database connections established successfully.');
} catch (error) {
  console.error('Error establishing database connections:', error);
}

export { db1, db2 , db3 };
