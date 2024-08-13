import express from 'express';
import { forgotPassword, insertData, loginUser, logoutUser, resetPassword, Signup } from '../Controllers/controllers';
import { authenticateJWT } from '../Middleware/jwttoken';
import { selectDatabse } from '../Middleware/selectDatabase';

const route = express.Router();

// Routes
route.post('/signup',selectDatabse, Signup);

route.post('/login',selectDatabse, loginUser);

route.post('/insert-data',selectDatabse, authenticateJWT, insertData);

route.post('/logout',selectDatabse, logoutUser);

route.post('/forgot-password',selectDatabse, forgotPassword);

route.post('/reset-password',selectDatabse, resetPassword);


export default route;