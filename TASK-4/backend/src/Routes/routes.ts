import express from 'express';
import { insertData, loginUser, Signup } from '../Controllers/controllers';

const route = express.Router();

// Routes
route.post('/signup',Signup);

route.post('/login',loginUser);

route.post('/insert-data',insertData);


export default route;