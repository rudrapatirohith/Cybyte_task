import express from 'express';
import dotenv from 'dotenv';
import { db1, db2 } from './database.js'; // Import the connection pools
import authRouter from './auth.js'; // Import the auth router
import { createUser } from './auth0.js'; // Import Auth0 functions

dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 6000;

app.use(express.json()); // Middleware to parse JSON request bodies

// Basic GET route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Route for /api/users - Example route
app.get('/api/users', async (req, res) => {
  try {
    // Example: Get users from database or create a user
    const [usersFromDb1] = await db1.query('SELECT * FROM users');
    const [usersFromDb2] = await db2.query('SELECT * FROM users');
    res.json({ db1Users: usersFromDb1, db2Users: usersFromDb2 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Test the MySQL connection by querying the database
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows1] = await db1.query('SELECT 1 + 1 AS result');
    const [rows2] = await db2.query('SELECT 2 + 2 AS result');
    res.json({ db1Result: rows1[0].result, db2Result: rows2[0].result });
  } catch (error) {
    res.status(500).json({ error: 'Database query failed', details: error.message });
  }
});

// Route to create a user in Auth0 and insert into a database
app.post('/api/users', async (req, res) => {
  const { name, email, password, database } = req.body;

  try {
    // Create user in Auth0
    const user = await createUser({
      connection: 'Username-Password-Authentication', // Replace with your Auth0 connection name
      email,
      password,
      name
    });

    // Determine which database to use
    const db = database === 'db1' ? db1 : db2;

    // Insert user data into the selected database
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);

    res.status(201).json({ message: 'User created successfully', auth0User: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
