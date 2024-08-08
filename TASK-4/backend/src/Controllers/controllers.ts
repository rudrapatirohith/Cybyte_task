import { Request,Response } from "express";
import insertInfo from "../Models/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config({path: '././config.env'});


//Controller to handlle user signup
export const Signup = async(req:Request,res:Response)=>{
    const {name,email,password} = req.body;

    try{

        //Hasing the password
        const hashedPassword = await bcrypt.hash(password,7);

        // saves data in db for login purpose
 const [result] = await insertInfo.query<ResultSetHeader>('INSERT INTO users (name,email,password) VALUES(?,?,?)',[name,email,hashedPassword])
 res.status(201).json({ message: 'User Signed up successfully', userId: result.insertId });
    }
    catch(error){
        res.status(500).json({ message: 'Invalid Credentials' });
    }
};



//Controller to handlle user login
export const loginUser = async(req:Request,res:Response)=>{
const {email,password} = req.body;

if(!email || !password){
    res.status(404).json({ message: 'Enter the Credentials' });
}

try{
    //checks and login 
    const [rows] = await insertInfo.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?',[email]);

    if(rows.length>0){
        const userId=rows[0].id;
        const user =rows[0];
        const passwordMatch = await bcrypt.compare(password,user.password);

        if(passwordMatch){
            // Generate JWT token
            const token = jwt.sign({ userId: user.id, email: user.email},process.env.JWT_SECRET as string,{expiresIn: '1h'}); 
            res.status(201).json({ message: 'User Logged in successfully', userId: userId ,token});
        }
        else{
            res.status(401).json({ message: 'Invalid Credentials' });
        }
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




// Controller to handle user registration - data will be stored in usersinfo db
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
            console.error('Insert Data Error:', error);
          res.status(500).json({ message: 'Internal server error' });
    }
};


// Controller to handle user logout
export const logoutUser = (req: Request, res: Response) => {
    res.status(200).json({ message: 'User logged out successfully' });
  };



  // Controller to handle forgot password
  export const forgotPassword = async(req:Request, res:Response)=>{
    const {email} = req.body;

    try{
        const [rows] = await insertInfo.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?',[email]);
       
        if (rows.length > 0) {
            const token = jwt.sign({ userId: rows[0].id, email }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
      
        // Here we will send the token to users email 
        res.status(200).json({message:'Password reset token sent to email',token})
    }
    else{
        res.status(404).json({ message: 'Email not found' });
    }
}
    catch(error){
        res.status(500).json({ message: 'Internal server error' });
    }
  };


  // Controller to handle reset password

  export const resetPassword = async(req:Request,res:Response)=>{
    const {token,newPassword} = req.body;

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload;

        const hashedPassword = await bcrypt.hash(newPassword,7);
        await insertInfo.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword,decoded.userId])
        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch(error){
        res.status(400).json({ message: 'Invalid or expired token' });
    }
  }