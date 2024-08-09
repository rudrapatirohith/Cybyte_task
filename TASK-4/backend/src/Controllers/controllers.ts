import { Request, Response } from "express";
import { createConnection, insertInfo } from "../Models/database";
import { RowDataPacket } from "mysql2";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '././config.env' });

// Controller to handle user signup
export const Signup = (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    console.log("Received data:", { name, email, password });

    bcrypt.hash(password, 7)
        .then(hashedPassword => {
            return insertInfo.query('CALL InsertUser(?, ?, ?, @userId)', [name, email, hashedPassword]);
        })
        .then(() => {
            return insertInfo.query<RowDataPacket[]>('SELECT @userId AS userId');
        })
        .then(([result]) => {
            res.status(201).json({ message: 'User Signed up successfully', userId: result[0].userId });
        })
        .catch(error => {
            console.error("Error during signup:", error);
            res.status(500).json({ message: 'Invalid Credentials' });
        });
};

// Controller to handle user login
export const loginUser = (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(404).json({ message: 'Enter the Credentials' });
        return;
    }

    console.log("Request body:", req.body);
    console.log("Email:", email);
    console.log("Password:", password);

    insertInfo.query<RowDataPacket[]>('CALL GetUser(?)', [email])
        .then(([rows]) => {
            if (rows.length > 0) {
                const user = rows[0];
                console.log("Fetched user:", user);

                if (!password || !user[0].password) {
                    throw new Error('Internal Server Error');
                }

                return bcrypt.compare(password, user[0].password)
                    .then(passwordMatch => {
                        if (passwordMatch) {
                            const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
                            res.status(201).json({ message: 'User Logged in successfully', userId: user.id, token });
                        } else {
                            res.status(401).json({ message: 'Invalid Credentials' });
                        }
                    });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};

// Controller to handle user registration - data will be stored in usersinfo db
export const insertData = (req: Request, res: Response) => {
    const { text_field, multi_line_text, email, telephone, number_field, date_field, time_field, timestamp_field, checkbox_field, dropdown_field, radio_list, checkbox_list, pdf_file, image_file, list_box } = req.body;

    insertInfo.query<RowDataPacket[]>('CALL InsertUserData(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @userId)',
        [text_field, multi_line_text, email, telephone, number_field, date_field, time_field, timestamp_field, checkbox_field, dropdown_field, radio_list, checkbox_list, pdf_file, image_file, list_box])
        .then(() => {
            return insertInfo.query<RowDataPacket[]>('SELECT @userId AS userId');
        })
        .then(([result]) => {
            res.status(201).json({ message: 'Data inserted successfully', userId: result[0].userId });
        })
        .catch(error => {
            console.error('Insert Data Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        });
};

// Controller to handle user logout
export const logoutUser = (req: Request, res: Response) => {
    res.status(200).json({ message: 'User logged out successfully' });
};

// Controller to handle forgot password
export const forgotPassword = (req: Request, res: Response) => {
    const { email } = req.body;

    insertInfo.query<RowDataPacket[]>('CALL GetUserIdByEmail(?, @userId)', [email])
        .then(() => {
            return insertInfo.query<RowDataPacket[]>('SELECT @userId AS userId');
        })
        .then(([result]) => {
            if (result[0].userId) {
                const token = jwt.sign({ userId: result[0].userId, email }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
                res.status(200).json({ message: 'Password reset token sent to email', token });
            } else {
                res.status(404).json({ message: 'Email not found' });
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Internal server error' });
        });
};

// Controller to handle reset password
export const resetPassword = (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    let decoded: JwtPayload;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    bcrypt.hash(newPassword, 7)
        .then(hashedPassword => {
            return insertInfo.query('CALL UpdateUserPassword(?, ?)', [decoded.userId, hashedPassword]);
        })
        .then(() => {
            res.status(200).json({ message: 'Password reset successfully' });
        })
        .catch(error => {
            res.status(500).json({ message: 'Internal server error' });
        });
};

export const testMultiDb = (req: Request, res: Response) => {
    const { id } = req.params;

    createConnection(id)
        .then(db => {
            if (id === '1') {
                return db.query('SELECT * FROM users');
            } else if (id === '2') {
                return db.query('SELECT * FROM usersInfo');
            } else {
                throw new Error('Invalid ID provided');
            }
        })
        .then(([result]) => {
            res.status(200).json(result);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};
