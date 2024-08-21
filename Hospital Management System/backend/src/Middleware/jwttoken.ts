import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '././config.env' });
console.log(process.env.PORT);

// Middleware to authenticate JWT tokens
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    // I am checking if the Authorization header is present in the request
    const authHeader = req.headers.authorization;

    if (authHeader) {
        // I am extracting the token from the Authorization header
        const token = authHeader.split(' ')[1];

        // I am verifying the token using the secret key
        jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
            if (err) {
                // If the token is invalid or expired, I am sending a 403 Forbidden response
                return res.status(403).json({ message: 'Forbidden' });
            }

            // I am attaching the user info to the request object for use in later middleware/routes
            (req as any).user = user;
            // I am calling the next middleware or route handler
            next();
        });
    } else {
        // If the Authorization header is missing, I am sending a 401 Unauthorized response
        res.status(401).json({ message: 'Unauthorized' });
    }
};
