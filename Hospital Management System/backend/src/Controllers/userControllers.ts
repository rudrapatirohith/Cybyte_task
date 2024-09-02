import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PoolConnection } from 'mysql2/promise';
import { UserModel, User } from '../Models/userModel';

// Extend the Request type to include `db`
interface CustomRequest extends Request {
    db?: PoolConnection;
}

// Signup Controller
export const Signup = (req: CustomRequest, res: Response): void => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    const db: PoolConnection = req.db as PoolConnection;

    bcrypt.hash(password, 10)
        .then((hashedPassword) => {
            const newUser: User = { name, email, password: hashedPassword };
            return UserModel.signup(newUser, db);
        })
        .then(() => {
            res.status(201).json({ message: 'User registered successfully' });
        })
        .catch((error: Error) => {
            console.error('Error during signup:', error);
            res.status(500).json({ message: 'Internal server error' });
        });
};

// Login Controller
export const loginUser = (req: CustomRequest, res: Response): void => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }

    const db: PoolConnection = req.db as PoolConnection;

    UserModel.findByEmail(email, db)
        .then((user: User | null) => {
            if (!user) {
                res.status(401).json({ message: 'Invalid email or password' });
                return;
            }

            bcrypt.compare(password, user.password)
                .then((isMatch: boolean) => {
                    if (!isMatch) {
                        res.status(401).json({ message: 'Invalid email or password' });
                        return;
                    }

                    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });


                    res.status(200).json({ token });
                })
                .catch((error: Error) => {
                    console.error('Error comparing passwords:', error);
                    res.status(500).json({ message: 'Internal server error' });
                });
        })
        .catch((error: Error) => {
            console.error('Error finding user:', error);
            res.status(500).json({ message: 'Internal server error' });
        });
};

// Update User Controller
export const updateUser = (req: CustomRequest, res: Response): void => {
    const { id, name, email, password } = req.body;

    if (!id || !name || !email || !password) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    const db: PoolConnection = req.db as PoolConnection;

    bcrypt.hash(password, 10)
        .then((hashedPassword) => {
            const updatedUser: User = { id, name, email, password: hashedPassword };
            return UserModel.update(updatedUser, db);
        })
        .then(() => {
            res.status(200).json({ message: 'User updated successfully' });
        })
        .catch((error: Error) => {
            console.error('Error during update:', error);
            res.status(500).json({ message: 'Internal server error' });
        });
};

// Delete User Controller
export const deleteUser = (req: CustomRequest, res: Response): void => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
    }

    const db: PoolConnection = req.db as PoolConnection;

    UserModel.delete(email, db)
        .then(() => {
            res.status(200).json({ message: 'User deleted successfully' });
        })
        .catch((error: Error) => {
            console.error('Error during delete:', error);
            res.status(500).json({ message: 'Internal server error' });
        });
};

// Controller to handle forgot password
export const forgotPassword = (req: CustomRequest, res: Response): void => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
    }

    const db: PoolConnection = req.db as PoolConnection;

    UserModel.forgotPassword(email, db)
        .then((token) => {
            if (token) {
                res.status(200).json({ message: 'Password reset token generated successfully', token });
            } else {
                res.status(404).json({ message: 'Email not found' });
            }
        })
        .catch((error: any) => {
            console.error('Forgot Password Error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};

// Controller to handle reset password
export const resetPassword = (req: CustomRequest, res: Response): void => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        res.status(400).json({ message: 'Token and new password are required' });
        return;
    }

    const db: PoolConnection = req.db as PoolConnection;

    const decoded = UserModel.validateToken(token);

    if (!decoded) {
        res.status(400).json({ message: 'Invalid or expired token' });
        return;
    }

    UserModel.resetPassword(decoded.email, newPassword, db)
        .then(() => {
            res.status(200).json({ message: 'Password reset successfully' });
        })
        .catch((error: any) => {
            console.error('Reset Password Error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};

// Logout Controller
export const logoutUser = (req: CustomRequest, res: Response): void => {
    // Logout logic: Typically handled by client-side by removing the token
    res.status(200).json({ message: 'Logged out successfully' });
};
