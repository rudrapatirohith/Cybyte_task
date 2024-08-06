import { Request,Response } from "express";
import insertInfo from "./database";
import { ResultSetHeader } from "mysql2";


//Controller to handlle user login
export const loginUser = async(req:Request,res:Response)=>{
const {email,password} = req.body;
try{
 // Redirect to data input page
 const [result] = await insertInfo.query<ResultSetHeader>('INSERT INTO userdata (email,password) VALUES(?,?)',[email,password])
 res.status(201).json({ message: 'User Logged in successfully', userId: result.insertId });
}
catch (error) {
    console.error('Login error:', error);
    // Handle any errors
    res.status(500).json({ message: 'Internal server error' });
}
};

// Controller to handle user registration
export const insertData = async(req:Request,res:Response)=>{
    const { text_field, multi_line_text, email,telephone, number_field, date_field, time_field, timestamp_field, checkbox_field, dropdown_field, radio_list, checkbox_list, pdf_file, image_file, list_box } = req.body;

    try{

        // Insert user data into the database
        const [result] = await insertInfo.query<ResultSetHeader>(`
            INSERT INTO users (text_field, multi_line_text, email,telephone, number_field, date_field, time_field, timestamp_field, checkbox_field, dropdown_field, radio_list, checkbox_list, pdf_file, image_file, list_box)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [text_field, multi_line_text, email, telephone, number_field, date_field, time_field, timestamp_field, checkbox_field, dropdown_field, radio_list, checkbox_list, pdf_file, image_file, list_box]);
          
            res.status(201).json({ message: 'Data inserted successfully', userId: result.insertId });
        } 
    
        catch (error) {
          res.status(500).json({ message: 'Internal server error' });
    }
};



