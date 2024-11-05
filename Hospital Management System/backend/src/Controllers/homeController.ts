import { Request, Response } from "express"; // Import necessary types
import { PoolConnection } from "mysql2/promise";

// Update the function to accept Request and Response types
export const getAllFormDataInfo = async (req: Request, res: Response) => {
    const db: PoolConnection = (req as Request & { db: PoolConnection }).db; // Retrieve db from request
    const query = "SELECT id,name,email FROM patients"; 

    try {
        const [rows] = await db.query(query); // Execute the query
        res.status(200).json(rows); // Send the result as JSON response
    } catch (error) {
        console.error('Error fetching data from database:', error);
        res.status(500).json({ message: 'Internal server error' }); // Handle error response
    }
};
