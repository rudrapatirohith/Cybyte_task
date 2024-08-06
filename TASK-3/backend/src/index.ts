import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { insertData, loginUser } from './controllers';

dotenv.config({path: './config.env'});

const app = express();
const port = process.env.PORT ;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/login',loginUser);

app.post('/insert-data',insertData);

app.use(express.static('public'));

app.listen(port,()=>{console.log(`Server Started running on http://localhost:${port} `);

})