import { Request, Response, NextFunction } from "express";
import { createConnection } from "../Models/database";
import { PoolConnection } from "mysql2/promise";

export const selectDb = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;

    if (id !== '1' && id !== '2') {
        return res.status(400).json({ message: 'Database ID is Incorrect' });
    }

    createConnection(id)
        .then((pool) => pool.getConnection())
        .then((db: PoolConnection) => {
            (req as Request & { db: PoolConnection }).db = db;
            console.log(`Connected to database with ID: ${id}`);
            res.on('finish', () => {
                db.release();
                console.log(`Connection to database with ID: ${id} has been released`);
            });
            next();
        })
        .catch((error) => {
            console.error('Database connection error:', error);
            res.status(500).json({ message: 'Internal server error' });
        });
};
