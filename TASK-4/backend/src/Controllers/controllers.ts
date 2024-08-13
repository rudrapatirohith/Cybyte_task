import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '././config.env' });

declare module 'express' {
    interface Request {
        db?: any;
    }
}

// Controller to handle user signup
export const Signup = (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    console.log("Received data:", { name, email, password });

    bcrypt.hash(password, 7)
        .then(hashedPassword => {
            return req.db.query('INSERT INTO patientsAuth (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        })
        .then((result: any) => {
            res.status(201).json({ message: 'User Signed up successfully', userId: result.insertId });
        })
        .catch((error: any) => {
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

    req.db.query('SELECT * FROM patientsAuth WHERE email = ?', [email])
        .then((result: any) => {
            const rows = result[0];
            if (rows.length > 0) {
                const user = rows[0];
                console.log("Fetched user:", user);

                if (!password || !user.password) {
                    throw new Error('Internal Server Error');
                }

                return bcrypt.compare(password, user.password)
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
        .catch((error: any) => {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};



export const insertData = (req: Request, res: Response) => {
    const {
        text_field, multi_line_text, email, telephone, number_field,
        date_field, time_field, timestamp_field, checkbox_field, dropdown_field,
        radio_list, checkbox_list, pdf_file, image_file, list_box
    } = req.body;

    req.db.query(
        'INSERT INTO patientsInfo (text_field, multi_line_text, email, telephone, number_field, date_field, time_field, timestamp_field, checkbox_field, dropdown_field, radio_list, checkbox_list, pdf_file, image_file, list_box) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [text_field, multi_line_text, email, telephone, number_field, date_field, time_field, timestamp_field, checkbox_field, dropdown_field, radio_list, checkbox_list, pdf_file, image_file, list_box]
    )
        .then((result: any) => {
            res.status(201).json({ message: 'Data inserted successfully', userId: result.insertId });
        })
        .catch((error: any) => {
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

    req.db.query('SELECT id FROM patientsAuth WHERE email = ?', [email])
        .then((result: any) => {
            if (result.length > 0) { // Ensure result is not empty
                console.log(result);

                const userId = result[0][0].id; // Access the id correctly

                // Log userId and token payload
                console.log("User ID:", userId);

                const token = jwt.sign({ userId, email }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
                console.log("Generated Token:", token);

                res.status(200).json({ message: 'Password reset token sent to email', token });
            } else {
                res.status(404).json({ message: 'Email not found' });
            }
        })
        .catch((error: any) => {
            console.error('Forgot Password Error:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        });
};



// Controller to handle reset password
export const resetPassword = (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    let decoded: JwtPayload;

    try {
        // Decode the token
        decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        console.log("Decoded Token:", decoded); // Log to verify the token content
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    bcrypt.hash(newPassword, 7)
        .then(hashedPassword => {
            console.log("Hashed Password:", hashedPassword);
            console.log("User ID from Token:", decoded.userId); // Ensure this matches

            // Update the password in the database
            return req.db.query('UPDATE patientsAuth SET password = ? WHERE id = ?', [hashedPassword, decoded.userId]);
        })
        .then((result: any) => {
            if (result[0].affectedRows > 0) {
                res.status(200).json({ message: 'Password reset successfully' });
            } else {
                res.status(400).json({ message: 'Password reset failed. No user found with the provided ID.' });
            }
        })
        .catch((error: any) => {
            console.error('Reset Password Error:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        });
};
