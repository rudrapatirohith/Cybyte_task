import express from 'express';
import dotenv from 'dotenv';
import { db1, db2, db3 } from './database.js';
import { createUser } from './auth0.js';
import { expressjwt as jwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 6000;

app.use(express.json());

// Basic GET route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// JWT authentication middleware
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// // Middleware to attach user database info to request
// const attachUserDatabase = (req, res, next) => {
//   const user = req.auth; // Authenticated user info from JWT

//   // Example: Attach user database information to the request object
//   if (user && user['https://example.com/database']) {
//     req.userDatabase = user['https://example.com/database'];
//   } else {
//     return res.status(401).json({ message: 'Unauthorized: No database info' });
//   }

//   next();
// };

// Protected route example
app.get('/api/protected', checkJwt, (req, res) => {
  res.send('This is a protected route.');
});


// // Route to fetch data from the database based on user info
// app.get('/api/data', checkJwt, attachUserDatabase, async (req, res) => {
//   try {
//     // Select the database based on user's info
//     const db = req.userDatabase === 'db1' ? db1 : db2;

//     // Query the selected database
//     const [data] = await db.query('SELECT * FROM your_table'); // Adjust the query as needed

//     // Return the data in the response
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch data', details: error.message });
//   }
// });

// Route to create a user in Auth0 and insert into a database
app.post('/api/users', async (req, res) => {
  const { name, email, password, database } = req.body;

  try {
    const user = await createUser({
      connection: 'Username-Password-Authentication',
      email,
      password,
      name
    });

    const db = database === 'db1' ? db1 : db2;
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);

    res.status(201).json({ message: 'User created successfully', auth0User: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});







// POST: Create
app.post('/api/test', async(req,res)=>{
  const {name,age}= req.body;

  try{
    const [result] =await db3.query('INSERT INTO userinfo (name,age) VALUES (?,?)',[name,age]);
    res.status(200).json({status:200,message:'success',id: result.insertId});
  }
  catch(error){
    res.status(500).json({status:500, message: error.message});
  }
})



// PUT:Update
app.put('/api/test/:id',async(req,res)=>{
  const{id}=req.params;
  const {name,age} = req.body;

  // Check if ID and fields are provided
  if (!id || !name || age === undefined) {
    return res.status(400).json({ status: 400, message: 'Bad Request: Missing required fields' });
  }

  try{
    const [result] = await db3.query('UPDATE userinfo SET name = ?, age = ? WHERE id = ?',[name,age,id]);
    
    if(result.affectedRows>0){
      res.status(200).json({status: 200, message:'success'});
    }
    else{
      res.status(404).json({status: 404,message: 'Record not found'});
    }
  }
  catch(error){
    console.error('Error in PUT request:', error);

    res.status(500).json({status:500, message:error.message});
  }
});



//GET: Read
app.get('/api/test/:id',async(req,res)=>{
  const {id} = req.params;
  try{
    const [rows] = await db3.query('SELECT * from userinfo WHERE id = ? ',[id])
    if(rows.length>0){
      res.status(200).json({status:200,data: rows[0]});
    }
    else{
      res.status(404).json({status:404,message:'Record not found'});
    }
  }
  catch{
    res.status(500).json({status:500,message: error.message});
  }
})

//GET: Read all
app.get('/api/test',async(req,res)=>{

  try{
    const [rows] = await db3.query('SELECT * from userinfo')

    if(rows.length>0){
      res.status(200).json({status:200,data: rows});
    }
    else{
      res.status(404).json({status:404,message:'Record not found'});
    }
  }
  catch{
    res.status(500).json({status:500,message: error.message});
  }
})




//DELETE: Delete
app.delete('/api/test/:id', async(req,res)=>{
  const {id} = req.params;
  try{
    const [result] = await db3.query('DELETE FROM userinfo WHERE id=?',[id]);
    if(result.affectedRows>0){
      res.status(200).json({status:200,message:'success'});
    }
    else{
      res.status(404).json({status:404,message:'Record not found'});
    }
  }
    catch(error){
      res.status(500).json({status:500,message:error.message});
  }
})


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
