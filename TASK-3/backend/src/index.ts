import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loginData from './database';

dotenv.config();

const app = express();
const port = process.env.PORT || 4242;

app.listen(port,()=>{console.log(`Server Started running on http://localhost:${port} `);

})