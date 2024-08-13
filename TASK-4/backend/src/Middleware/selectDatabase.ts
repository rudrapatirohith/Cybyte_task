import { Request,Response,NextFunction } from "express";
import { createConnection } from "../Models/database";
import { Connection } from "mysql2/promise";


export const selectDatabse = (req:Request,res: Response,next: NextFunction)=>{
    const {id} = req.body;

    if(!id){
        return res.status(400).json({message: 'Database ID is required'});
    }

    // I am creating a connection to the appropriate database based on the provided ID
    createConnection(id)
    .then((db)=>{
        (req as Request & { db: Connection }).db = db; // I'm asserting the type of req to include db
        // I am logging which database is connected
        console.log(`Connected to database with ID: ${id}`);
        next();  // I am passing control to the next middleware or route handler
    })
    .catch((error)=>{
        console.error('Database connection error:', error);
        res.status(500).json({message:'Internal server error'});
        
    })
}