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

    // I am hashing the user's password with a salt factor of 7
    bcrypt.hash(password, 7)
        .then(hashedPassword => {
            // I am inserting the new user into the database with the hashed password
            return insertInfo.query('CALL InsertUser(?, ?, ?, @userId)', [name, email, hashedPassword]);
        })
        .then(() => {
            // I am retrieving the userId of the newly inserted user
            return insertInfo.query<RowDataPacket[]>('SELECT @userId AS userId');
        })
        .then(([result]) => {
            // I am sending a success response with the userId of the newly created user
            res.status(201).json({ message: 'User Signed up successfully', userId: result[0].userId });
        })
        .catch(error => {
            // If there's an error, I log it and send a 500 response with an error message
            console.error("Error during signup:", error);
            res.status(500).json({ message: 'Invalid Credentials' });
        });
};

// Controller to handle user login
export const loginUser = (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        // I am checking if the email and password are provided
        res.status(404).json({ message: 'Enter the Credentials' });
        return;
    }

    console.log("Request body:", req.body);
    console.log("Email:", email);
    console.log("Password:", password);

    // I am retrieving the user with the given email from the database
    insertInfo.query<RowDataPacket[]>('CALL GetUser(?)', [email])
        .then(([rows]) => {
            if (rows.length > 0) {
                const user = rows[0];
                console.log("Fetched user:", user);

                if (!password || !user[0].password) {
                    // If password is missing, I am throwing an error
                    throw new Error('Internal Server Error');
                }

                // I am comparing the provided password with the stored hashed password
                return bcrypt.compare(password, user[0].password)
                    .then(passwordMatch => {
                        if (passwordMatch) {
                            // If passwords match, I am generating a JWT token
                            const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
                            // I am sending a success response with the userId and token
                            res.status(201).json({ message: 'User Logged in successfully', userId: user.id, token });
                        } else {
                            // If passwords don't match, I am sending a 401 response
                            res.status(401).json({ message: 'Invalid Credentials' });
                        }
                    });
            } else {
                // If no user is found, I am sending a 401 response
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            // If there's an error, I log it and send a 500 response with an error message
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};

// Controller to handle user registration - data will be stored in usersinfo db
export const insertData = (req: Request, res: Response) => {
    const {
        text_field, multi_line_text, email, telephone, number_field,
        date_field, time_field, timestamp_field, checkbox_field, dropdown_field,
        radio_list, checkbox_list, pdf_file, image_file, list_box
    } = req.body;

    // I am inserting user data into the database
    insertInfo.query<RowDataPacket[]>('CALL InsertUserData(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @userId)',
        [text_field, multi_line_text, email, telephone, number_field, date_field,
         time_field, timestamp_field, checkbox_field, dropdown_field, radio_list,
         checkbox_list, pdf_file, image_file, list_box])
        .then(() => {
            // I am retrieving the userId of the newly inserted user data
            return insertInfo.query<RowDataPacket[]>('SELECT @userId AS userId');
        })
        .then(([result]) => {
            // I am sending a success response with the userId of the inserted data
            res.status(201).json({ message: 'Data inserted successfully', userId: result[0].userId });
        })
        .catch(error => {
            // If there's an error, I log it and send a 500 response with an error message
            console.error('Insert Data Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        });
};

// Controller to handle user logout
export const logoutUser = (req: Request, res: Response) => {
    // I am sending a success response for user logout
    res.status(200).json({ message: 'User logged out successfully' });
};

// Controller to handle forgot password
export const forgotPassword = (req: Request, res: Response) => {
    const { email } = req.body;

    // I am retrieving the userId using the provided email
    insertInfo.query<RowDataPacket[]>('CALL GetUserIdByEmail(?, @userId)', [email])
        .then(() => {
            // I am retrieving the userId from the result
            return insertInfo.query<RowDataPacket[]>('SELECT @userId AS userId');
        })
        .then(([result]) => {
            if (result[0].userId) {
                // I am generating a password reset token and sending it
                const token = jwt.sign({ userId: result[0].userId, email }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
                res.status(200).json({ message: 'Password reset token sent to email', token });
            } else {
                // If no user is found, I am sending a 404 response
                res.status(404).json({ message: 'Email not found' });
            }
        })
        .catch(error => {
            // If there's an error, I log it and send a 500 response with an error message
            res.status(500).json({ message: 'Internal server error' });
        });
};

// Controller to handle reset password
export const resetPassword = (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    let decoded: JwtPayload;

    try {
        // I am verifying the provided token
        decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch (error) {
        // If the token is invalid or expired, I send a 400 response
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // I am hashing the new password
    bcrypt.hash(newPassword, 7)
        .then(hashedPassword => {
            // I am updating the user's password in the database
            return insertInfo.query('CALL UpdateUserPassword(?, ?)', [decoded.userId, hashedPassword]);
        })
        .then(() => {
            // I am sending a success response after resetting the password
            res.status(200).json({ message: 'Password reset successfully' });
        })
        .catch(error => {
            // If there's an error, I log it and send a 500 response with an error message
            res.status(500).json({ message: 'Internal server error' });
        });
};

// Controller to handle multi-database test
export const testMultiDb = (req: Request, res: Response) => {
    const { id } = req.params;

    // I am creating a connection to the appropriate database based on the provided ID
    createConnection(id)
        .then(db => {
            // I am querying the correct table based on the provided ID
            switch (id) {
                case '1':
                    return db.query('SELECT * FROM users');
                case '2':
                    return db.query('SELECT * FROM usersInfo');
                default:
                    // If the ID is invalid, I throw an error
                    throw new Error('Invalid database ID');
            }
        })
        .then(([rows]) => {
            // I am sending a success response with the fetched data
            res.status(200).json(rows);
        })
        .catch(error => {
            // If there's an error, I log it and send a 500 response with an error message
            console.error("Database query error:", error);
            res.status(500).json({ message: 'Internal server error' });
        });
};
