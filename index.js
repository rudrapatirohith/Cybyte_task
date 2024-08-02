import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

// Basic GET route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Route for /api/users
app.get('/api/users', (req, res) => {
  res.json([{ name: 'John Doe' }, { name: 'Jane Doe' }]);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
