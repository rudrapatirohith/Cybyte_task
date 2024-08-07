import { Request,Response } from "express";
import insertInfo from "../Models/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";

//Controller to handlle user signup
export const Signup = async(req:Request,res:Response)=>{
    const {name,email,password} = req.body;

    try{
        // saves data in db for login purpose
 const [result] = await insertInfo.query<ResultSetHeader>('INSERT INTO users (name,email,password) VALUES(?,?,?)',[name,email,password])
 res.status(201).json({ message: 'User Signed up successfully', userId: result.insertId });
    }
    catch(error){
        res.status(500).json({ message: 'Invalid Credentials' });
    }
}



//Controller to handlle user login
export const loginUser = async(req:Request,res:Response)=>{
const {email,password} = req.body;

if(!email || !password){
    res.status(404).json({ message: 'Enter the Credentials' });
}

try{
    //checks and login 
    const [rows] = await insertInfo.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ? AND password = ?',[email,password]);

    if(rows.length>0){
        const userId=rows[0].id;
        res.status(201).json({ message: 'User Logged in successfully', userId: userId });
    }
    else{
        res.status(401).json({ message: 'Invalid Credentials' });
    }
}
catch (error) {
    console.error('Login error:', error);
    // Handle any errors
    res.status(500).json({ message: 'Internal Server Error' });
}
};



// Controller to handle user registration
export const insertData = async(req:Request,res:Response)=>{
    const { text_field, multi_line_text, email,telephone, number_field, date_field, time_field, timestamp_field, checkbox_field, dropdown_field, radio_list, checkbox_list, pdf_file, image_file, list_box } = req.body;

    try{

        // Insert user data into the database
        const [result] = await insertInfo.query<ResultSetHeader>(`
            INSERT INTO usersinfo (text_field, multi_line_text, email,telephone, number_field, date_field, time_field, timestamp_field, checkbox_field, dropdown_field, radio_list, checkbox_list, pdf_file, image_file, list_box)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [text_field, multi_line_text, email, telephone, number_field, date_field, time_field, timestamp_field, checkbox_field, dropdown_field, radio_list, checkbox_list, pdf_file, image_file, list_box]);
          
            res.status(201).json({ message: 'Data inserted successfully', userId: result.insertId });
        } 
    
        catch (error) {
          res.status(500).json({ message: 'Internal server error' });
    }
};


