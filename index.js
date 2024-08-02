import express from 'express';
import { db1, db2 } from './database.js'; // Import the database connections
import authRouter from './auth.js'; // Import the auth router
import dotenv from 'dotenv'

dotenv.config({ path: './config.env' }); // Specify the path

const app = express();
const PORT = process.env.PORT || 6000;

app.use(express.json()); // Middleware to parse JSON request bodies

// Basic GET route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Route for /api/users
app.get('/api/users', (req, res) => {
  res.json([{ name: 'John Doe' }, { name: 'Jane Doe' }]);
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

// Use the auth router for /api/auth routes
app.use('/api/auth', authRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
