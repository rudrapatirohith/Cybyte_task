import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PoolConnection } from 'mysql2/promise';
import fs from 'fs';
import path from "path";


dotenv.config({ path: '././config.env' });

// Extending the Request interface to include a custom `db` property for database connection
declare module 'express' {
    interface Request {
        db?: PoolConnection;
        user?: JwtPayload;
    }
}

interface Files {
    [fieldname: string]: Express.Multer.File[]; // Multer files are stored as arrays
}

// Controller to handle user signup
export const Signup = (req: Request, res: Response) => {
    const { name, email, password } = req.body; // Extracting user data from the request body

    if (!name || !email || !password) {
        // If email or password is missing, send an error response
        res.status(404).json({ message: 'Enter the Credentials' });
        return;
    }
    console.log("Received data:", { name, email, password });

    bcrypt.hash(password, 7) // Hashing the user's password
        .then(hashedPassword => {
            if (!req.db) {
                throw new Error("Database connection not available");
            }
            // Inserting the user into the database with the hashed password
            return req.db?.query('INSERT INTO patientsAuth (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        })
        .then((result: any) => {
            // Sending a success response with the new user's ID
            res.status(201).json({ message: 'User Signed up successfully', userId: result[0].insertId });
        })
        .catch((error: any) => {
            // Handling errors during the signup process
            console.error("Error during signup:", error);
            res.status(500).json({ message: 'Invalid Credentials' });
        })
        .finally(() => {
            // Releasing the database connection after the operation is complete
            req.db?.release();
            console.log('Connection released after signup');
        });
};

// Controller to handle user login
export const loginUser = (req: Request, res: Response) => {
    const { email, password } = req.body; // Extracting login credentials from the request body

    if (!email || !password) {
        // If email or password is missing, send an error response
        res.status(404).json({ message: 'Enter the Credentials' });
        return;
    }

    console.log("Request body:", req.body);

    req.db?.query('SELECT * FROM patientsAuth WHERE email = ?', [email]) // Querying the database for the user's email
        .then((result: any) => {
            const rows = result[0];
            if (rows.length > 0) {
                // If the user is found, compare the provided password with the stored hash
                const user = rows[0];
                console.log("Fetched user:", user);

                return bcrypt.compare(password, user.password)
                    .then(passwordMatch => {
                        if (passwordMatch) {
                            // If the passwords match, generate a JWT token for the user
                            const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
                            res.status(201).json({ message: 'User Logged in successfully', userId: user.id, token });
                        } else {
                            // If the passwords don't match, send an error response
                            res.status(401).json({ message: 'Invalid Credentials' });
                        }
                    });
            } else {
                // If no user is found, send an error response
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch((error: any) => {
            // Handling errors during the login process
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        })
        .finally(() => {
            // Releasing the database connection after the operation is complete
            req.db?.release();
            console.log('Connection released after login');
        });
};



// Controller to handle user logout
export const logoutUser = (req: Request, res: Response) => {
    res.status(200).json({ message: 'User logged out successfully' }); // Sending a success response
    req.db?.release(); // Releasing the database connection after the operation is complete
    console.log('Connection released after logout');
};

// Controller to handle forgot password
export const forgotPassword = (req: Request, res: Response) => {
    const { email } = req.body; // Extracting email from the request body

    req.db?.query('SELECT id FROM patientsAuth WHERE email = ?', [email]) // Querying the database for the user's email
        .then((result: any) => {
            if (result[0].length > 0) {
                // If the user is found, generate a password reset token
                const userId = result[0][0].id;
                const token = jwt.sign({ userId, email }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
                res.status(200).json({ message: 'Password reset token sent to email', token });
            } else {
                // If no user is found, send an error response
                res.status(404).json({ message: 'Email not found' });
            }
        })
        .catch((error: any) => {
            // Handling errors during the forgot password process
            console.error('Forgot Password Error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        })
        .finally(() => {
            // Releasing the database connection after the operation is complete
            req.db?.release();
            console.log('Connection released after forgot password');
        });
};

// Controller to handle reset password
export const resetPassword = (req: Request, res: Response) => {
    const { token, newPassword } = req.body; // Extracting token and new password from the request body

    let decoded: JwtPayload;

    try {
        // Verifying and decoding the JWT token
        decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch (error) {
        // If the token is invalid or expired, send an error response
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    bcrypt.hash(newPassword, 7) // Hashing the new password
        .then(hashedPassword => {
            // Updating the user's password in the database
            return req.db?.query('UPDATE patientsAuth SET password = ? WHERE id = ?', [hashedPassword, decoded.userId]);
        })
        .then((result: any) => {
            if (result[0].affectedRows > 0) {
                // Sending a success response if the password is updated
                res.status(200).json({ message: 'Password reset successfully' });
            } else {
                // Sending an error response if the user ID is not found
                res.status(400).json({ message: 'Password reset failed. No user found with the provided ID.' });
            }
        })
        .catch((error: any) => {
            // Handling errors during the reset password process
            console.error('Reset Password Error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        })
        .finally(() => {
            // Releasing the database connection after the operation is complete
            req.db?.release();
            console.log('Connection released after password reset');
        });
};





// Controller to insert data
export const insertData = (req: Request, res: Response) => {
    let {
        text_field, multi_line_text, email, telephone, number_field,
        date_field, time_field, timestamp_field, checkbox_field, dropdown_field,
        radio_list, checkbox_list, list_box
    } = req.body; // Extracting data fields from the request body

    

    const parseJSON = (data: any) => {
        try {
            // Check if data is a string and looks like JSON
            if (typeof data === 'string' && (data.startsWith('{') || data.startsWith('['))) {
                return JSON.parse(data);
            }
            return data;
        } catch (e) {
            console.error('JSON Parsing Error:', e);
            return null;
        }
    };
    
    


    // // Parse incoming data if needed
    text_field = parseJSON(text_field);
    multi_line_text = parseJSON(multi_line_text);
    email = parseJSON(email);
    telephone = parseJSON(telephone);
    date_field = parseJSON(date_field);
    time_field = parseJSON(time_field);
    timestamp_field = parseJSON(timestamp_field);
    checkbox_field = parseJSON(checkbox_field);
    dropdown_field = parseJSON(dropdown_field);
    radio_list = parseJSON(radio_list);
    checkbox_list = parseJSON(checkbox_list);
    // list_box = Array.isArray(list_box) ? list_box : JSON.parse(list_box);
    list_box = parseJSON(list_box);

  // Cast req.files to the expected type
  const files = req.files as Record<string, Express.Multer.File[]>;
 
  if (!files) {
    return res.status(400).json({ message: 'No files uploaded' });
  }


  const pdf_file = files['pdf_file'] ? files['pdf_file'][0]?.filename : null; // Access the filename of the uploaded PDF
  const image_file = files['image_file'] ? files['image_file'][0]?.filename : null; // Access the filename of the uploaded image

    console.log(req.body);
    console.log('Uploaded Files:', { pdf_file, image_file });


    if(!text_field || !multi_line_text || !email || !telephone || !number_field ||
        !date_field || !time_field || !timestamp_field || !checkbox_field || !dropdown_field
      ||  !radio_list || !checkbox_list  || !list_box){
        res.status(401).json({message:'Missing data in some fields'})
      }

    // Parse incoming data if needed
    const userId = (req as any).user?.userId; // Get user ID from the request object
      
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    req.db?.query(
        'INSERT INTO patientsInfo (text_field, multi_line_text, email, telephone, number_field, date_field, time_field, timestamp_field, checkbox_field, dropdown_field, radio_list, checkbox_list, pdf_file, image_file, list_box,user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
        [text_field, multi_line_text, email, telephone, number_field, date_field, time_field, timestamp_field, checkbox_field, dropdown_field, radio_list, JSON.stringify(checkbox_list), pdf_file, image_file, JSON.stringify(list_box),userId]
    ) // Inserting the data into the database
        .then((result: any) => {
            // Sending a success response with the new data's ID
            res.status(201).json({ message: 'Data inserted successfully', userId: result[0].insertId });
        })
        .catch((error: any) => {
            // Handling errors during the data insertion process
            console.error('Insert Data Error:', error);     
            res.status(500).json({ message: 'Internal server error' });
        })
        .finally(() => {
            // Releasing the database connection after the operation is complete
            req.db?.release();
            console.log('Connection released after data insertion');
        });
};





// Controller to update data
export const updateData = (req: Request, res: Response) => {
    const {
        text_field, multi_line_text, email, telephone, number_field,
        date_field, time_field, timestamp_field, checkbox_field, dropdown_field,
        radio_list, checkbox_list, list_box
    } = req.body;

    const files = req.files as Record<string, Express.Multer.File[]>;

    const pdf_file = files['pdf_file'] ? files['pdf_file'][0]?.filename : null;
    const image_file = files['image_file'] ? files['image_file'][0]?.filename : null;


    console.log(req.body);
    console.log('Uploaded Files:', { pdf_file, image_file });

    if(!text_field || !multi_line_text || !email || !telephone || !number_field ||
        !date_field || !time_field || !timestamp_field || !checkbox_field || !dropdown_field
      ||  !radio_list || !checkbox_list  || !list_box){
        res.status(401).json({message:'Missing data in some fields'})
      }

    const userId = (req as any).user?.userId; 
    const recordId = (req as any).params?.id;

    req.db?.query(
        `UPDATE patientsInfo 
         SET text_field = ?, multi_line_text = ?, email = ?, telephone = ?, number_field = ?, 
             date_field = ?, time_field = ?, timestamp_field = ?, checkbox_field = ?, dropdown_field = ?, 
             radio_list = ?, checkbox_list = ?, pdf_file = COALESCE(?, pdf_file), image_file = COALESCE(?, image_file), list_box = ? 
         WHERE id = ? AND user_id = ?`,
        [text_field, multi_line_text, email, telephone, number_field, date_field, time_field, timestamp_field, checkbox_field, dropdown_field, radio_list, JSON.stringify(checkbox_list), pdf_file, image_file, JSON.stringify(list_box),recordId, userId]
    )
        .then((result: any) => {
            if(result[0].affectedRows > 0) {
                res.status(200).json({ message: 'Data updated successfully' });
            } else {
                res.status(404).json({ message: 'Record not found' });
            }
        })
        .catch((error: any) => {
            console.error('Update Data Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        })
        .finally(() => {
            req.db?.release();
            console.log('Connection released after data update');
        });
};



// Controller to get data by ID
export const getData = (req:Request,res:Response)=>{
    const userId = (req.user as JwtPayload).userId;

    req.db?.query('SELECT * FROM patientsInfo WHERE user_id = ?',[userId])
    .then((result:any)=>{
        console.log(result);
        
        const rows= result[0];
        if(rows.length>0){
             // Construct URLs for image and PDF files
      if (rows.image_file) {
        rows.image_file_url = `${req.protocol}://${req.get('host')}/uploads/${rows.image_file}`;
      }
      if (rows.pdf_file) {
        rows.pdf_file_url = `${req.protocol}://${req.get('host')}/uploads/${rows.pdf_file}`;
      }
            res.status(200).json({data: rows});
        }
        else{
            res.status(404).json({message:'Record not found'});
        }
    })
    .catch((error: any)=>{
        console.error('Get Data Error:', error);
        res.status(500).json({message:'Internal server error'});
    })
    .finally(()=>{
        req.db?.release();
        console.log('Connection released after data retrieval');
        
    })
}



// Controller to get data by ID
export const getDataById = (req:Request,res:Response)=>{
    const userId = (req.user as JwtPayload).userId;
    const recordId = (req as any).params?.id;


    req.db?.query('SELECT * FROM patientsInfo WHERE user_id = ? and id=?',[userId,recordId])
    .then((result:any)=>{
        console.log(result);
        
        const rows= result[0];
        if(rows.length>0){
            res.status(200).json({data: rows});
        }
        else{
            res.status(404).json({message:'Record not found'});
        }
    })
    .catch((error: any)=>{
        console.error('Get Data Error:', error);
        res.status(500).json({message:'Internal server error'});
    })
    .finally(()=>{
        req.db?.release();
        console.log('Connection released after data retrieval');
        
    })
}


// Controller to delete data by ID
export const deleteData = (req:Request,res:Response)=>{
    const userId = (req as any).user?.userId;
    const recordId = (req as any).params?.id;

    req.db?.query('DELETE FROM patientsInfo WHERE id =? AND user_id=?',[recordId,userId])
    .then((result:any)=>{
        if(result[0].affectedRows>0){
            res.status(200).json({message:'Data Deleted Successfully'});
        }
        else{
            res.status(404).json({message:'Record not found'});
        }
    })
    .catch((error:any)=>{
        console.error('Delete Data Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    })
    .finally(()=>{
        req.db?.release();
        console.log('Connection released after data deletion');
    });
};




