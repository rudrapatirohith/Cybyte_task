import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './Routes/routes'
import cors from 'cors';
import path from 'path';

dotenv.config({ path: './config.env' });

const app = express();
const port = process.env.PORT;


app.use(cors(
    {
        origin: 'http://localhost:4200', // my Angular app's URL
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
));

// This Middleware helps us to serve static files from the 'public' directory
app.use(bodyParser.json());
// app.use(express.json());


// Middleware to parse URL-encoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

// This Middleware helps us to parse JSON payloads
app.use(express.static('public'));

// Serve static files from the uploads directory
app.use('../uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', authRoutes);

app.listen(port, () => {
    console.log(`Server Started running on http://localhost:${port} `);

})