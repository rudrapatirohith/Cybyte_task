import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '././config.env' });
console.log(process.env.PORT);

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            // Attach user info to request object
           (req as any).user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
