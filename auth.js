import express from 'express';
import { db1, db2 } from './database.js';

const router = express.Router();

// POST route to create a new user
router.post('/', async (req, res) => {
  const { name, email, password, database } = req.body;

  try {
    // Determine which database to use
    const db = database === 'db1' ? db1 : db2;

    // Insert the new user into the selected database
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
