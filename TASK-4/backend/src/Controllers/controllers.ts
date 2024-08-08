import { Request, Response } from "express";
import insertInfo from "../Models/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '././config.env' });

// Controller to handle user signup
// Controller to handle user signup
export const Signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        console.log("Received data:", { name, email, password });

        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 7);
        // console.log("Hashed password:", hashedPassword);

        // Saves data in db for login purpose
        await insertInfo.query('CALL InsertUser(?, ?, ?, @userId)', [name, email, hashedPassword]);
        const [result] = await insertInfo.query<RowDataPacket[]>('SELECT @userId AS userId');
        // console.log("Stored procedure result:", result);

        res.status(201).json({ message: 'User Signed up successfully', userId: result[0].userId });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: 'Invalid Credentials' });
    }
};

// Controller to handle user login
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(404).json({ message: 'Enter the Credentials' });
        return;
    }

    try {

        console.log("Request body:", req.body);  // Log the entire request body
        console.log("Email:", email);  // Log the email
        console.log("Password:", password);  // Log the password


        // Checks and login
        const [rows] = await insertInfo.query<RowDataPacket[]>('CALL GetUser(?)', [email]);

        if (rows.length > 0) {
            const userId = rows[0].id;

            const user = rows[0];

            console.log("Fetched user:", user);

            // Ensure password and user.password are defined
            if (!password || !user[0].password) {
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }

            const passwordMatch = await bcrypt.compare(password, user[0].password);

            if (passwordMatch) {
                // Generate JWT token
                const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
                res.status(201).json({ message: 'User Logged in successfully', userId: userId, token });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        } else {
            res.status(401).json({ message: 'Invalid Credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Controller to handle user registration - data will be stored in usersinfo db
export const insertData = async (req: Request, res: Response) => {
    const { text_field, multi_line_text, email, telephone, number_field, date_field, time_field, timestamp_field, checkbox_field, dropdown_field, radio_list, checkbox_list, pdf_file, image_file, list_box } = req.body;

    try {
        // Insert user data into the database
        const [rows] = await insertInfo.query<RowDataPacket[]>('CALL InsertUserData(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @userId)',
            [text_field, multi_line_text, email, telephone, number_field, date_field, time_field, timestamp_field, checkbox_field, dropdown_field, radio_list, checkbox_list, pdf_file, image_file, list_box]);
        const [result] = await insertInfo.query<RowDataPacket[]>('SELECT @userId AS userId');

        res.status(201).json({ message: 'Data inserted successfully', userId: result[0].userId });
    } catch (error) {
        console.error('Insert Data Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to handle user logout
export const logoutUser = (req: Request, res: Response) => {
    res.status(200).json({ message: 'User logged out successfully' });
};

// Controller to handle forgot password
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const [rows] = await insertInfo.query<RowDataPacket[]>('CALL GetUserIdByEmail(?, @userId)', [email]);
        const [result] = await insertInfo.query<RowDataPacket[]>('SELECT @userId AS userId');

        if (result[0].userId) {
            const token = jwt.sign({ userId: result[0].userId, email }, process.env.JWT_SECRET as string, { expiresIn: '15m' });

            // Here we will send the token to user's email 
            res.status(200).json({ message: 'Password reset token sent to email', token });
        } else {
            res.status(404).json({ message: 'Email not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to handle reset password
export const resetPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        const hashedPassword = await bcrypt.hash(newPassword, 7);
        await insertInfo.query('CALL UpdateUserPassword(?, ?)', [decoded.userId, hashedPassword]);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};
