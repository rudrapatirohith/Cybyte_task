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



// Protected route example
app.get('/api/protected', checkJwt, (req, res) => {
  res.send('This is a protected route.');
});




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




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
