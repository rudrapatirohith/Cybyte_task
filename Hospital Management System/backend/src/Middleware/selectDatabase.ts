import { Request,Response,NextFunction } from "express";
import { createConnection } from "../Models/database";
import { Connection, Pool, PoolConnection } from "mysql2/promise";


export const selectDatabse = (req:Request,res: Response,next: NextFunction)=>{
    const {id} = req.body || '1';

    // if(!id){
    //     return res.status(400).json({message: 'Database ID is required'});
    // }

    if(id < 1 || id > 2){
        return res.status(400).json({message: 'Database ID is Incorrect'});
    }

    // I am creating a connection to the appropriate database based on the provided ID
    createConnection(id)
    .then((pool:Pool)=>{
        // Acquiring a connection from the pool
        return pool.getConnection()
        .then((db: PoolConnection)=>{
            (req as Request & { db: Connection }).db = db; // I'm asserting the type of req to include db
            // I am logging which database is connected
            console.log(`Connected to database with ID: ${id}`);

        // Ensuring the connection is released after the response is sent
            res.on('finish',()=>{
                db.release();   // Releasing the connection back to the pool
                console.log(`Connection to database with ID: ${id} has been released`);

            })
            next();  // I am passing control to the next middleware or route handler
        })

    })
    .catch((error)=>{
        console.error('Database connection error:', error);
        res.status(500).json({message:'Internal server error'});
        
    })
}