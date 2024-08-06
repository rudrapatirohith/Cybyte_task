import express from 'express';
import dotenv from 'dotenv';
import { db1, db2, db3 } from './database.js';
import { createUser,getAccessTokenForUser,getAuth0AccessToken,loginUser } from './auth0.js';
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


// Middleware to select the appropriate database based on the user email
const selectDatabase=async(req,res,next)=>{
  try{
    const email = req.auth;

    if(email=== 'rudrapati@gmail.com'){
      req.db = db1;
    }
    else if(email === 'rohith@gmail.com'){
      req.db = db2;
    }
    else{
      return res.status(403).json({ message: 'Unauthorized user' });
    }
    next();
  }
  catch(error){
    console.log('Error selecting database:',error);
    res.status(500).json({message:'Internal Server Error'});
  }
}





// Protected route example
app.get('/api/protected', checkJwt, selectDatabase, (req, res) => {
  res.send(`This is a protected route accessing ${req.db.config.database}.`);
});




// Route to create a user in Auth0 and return an access token

app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Get Auth0 Management API access token
    const managementToken = await getAuth0AccessToken();

    // Create the user in Auth0
    const user = await createUser({
      connection: 'Username-Password-Authentication',
      email,
      password,
      name
    });

    // Generate an Auth0 token for the created user
    const userToken = await getAccessTokenForUser(email, password); // Adjusted function call

    // Insert the user into the appropriate database
    const db = database === 'db1' ? db1 : db2;
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);

    res.status(201).json({ message: 'User created successfully', auth0User: user, userToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Route to log in a user
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const tokenData = await loginUser(email, password);
    res.status(200).json(tokenData);
  } catch (error) {
    res.status(500).json({error: 'Invalid credentials'  });
  }
});


// Route to switch users (logout and login again)
app.post('/api/switch-user', checkJwt,selectDatabase, (req, res) => {
  try {
    const { email } = req.body;

    // Validate the new email
    if (!email) {
      return res.status(400).json({ message: 'Email is required to switch user' });
    }

    res.status(200).json({ message: 'User switched successfully. Please login with the new user.' });
  } catch (error) {
    res.status(500).json({ message: 'Error switching user', error: error.message });
  }
});



// POST: Create
app.post('/api/test', async (req, res) => {
  const { name, age } = req.body;

  if (!name || age === undefined) {
    return res.status(400).json({ status: 400, message: 'Bad Request: Missing required fields' });
  }

  try {
    const [result] = await db3.query('CALL insertUserInfo(?, ?)', [name, age]);
    res.status(200).json({ status: 200, message: 'success', id: result.insertId });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});


// PUT: Update
app.put('/api/test/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;

  if (!id || !name || age === undefined) {
    return res.status(400).json({ status: 400, message: 'Bad Request: Missing required fields' });
  }

  try {
    const [result] = await db3.query('CALL updateUserInfo(?, ?, ?)', [id, name, age]);

    if (result.affectedRows > 0) {
      res.status(200).json({ status: 200, message: 'success' });
    } else {
      res.status(404).json({ status: 404, message: 'Record not found' });
    }
  } catch (error) {
    console.error('Error in PUT request:', error);
    res.status(500).json({ status: 500, message: error.message });
  }
});


// GET: Read
app.get('/api/test/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db3.query('CALL getUserInfo(?)', [id]);

    if (rows[0].length > 0) {
      res.status(200).json({ status: 200, data: rows[0] });
    } else {
      res.status(404).json({ status: 404, message: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

// GET: Read all
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await db3.query('CALL getAllUsersInfo()');

    if (rows[0].length > 0) {
      res.status(200).json({ status: 200, data: rows[0] });
    } else {
      res.status(404).json({ status: 404, message: 'No records found' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

// DELETE: Delete
app.delete('/api/test/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db3.query('CALL deleteUserinfo(?)', [id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ status: 200, message: 'success' });
    } else {
      res.status(404).json({ status: 404, message: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
