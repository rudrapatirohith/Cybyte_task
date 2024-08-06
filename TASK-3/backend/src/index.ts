import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { insertData, loginUser, Signup } from './controllers';

dotenv.config({path: './config.env'});

const app = express();
const port = process.env.PORT ;


// This Middleware helps us to serve static files from the 'public' directory
app.use(bodyParser.json());

// Middleware to parse URL-encoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

// This Middleware helps us to parse JSON payloads
app.use(express.static('public'));



// Routes
app.post('/signup',Signup);

app.post('/login',loginUser);

app.post('/insert-data',insertData);


app.listen(port,()=>{console.log(`Server Started running on http://localhost:${port} `);

})