import express from 'express';
import { forgotPassword, insertData, loginUser, logoutUser, resetPassword, Signup } from '../Controllers/controllers';
import { authenticateJWT } from '../Middleware/jwttoken';

const route = express.Router();

// Routes
route.post('/signup', Signup);

route.post('/login', loginUser);

route.post('/insert-data', authenticateJWT, insertData);

route.post('/logout', logoutUser);

route.post('/forgot-password', forgotPassword);

route.post('/reset-password', resetPassword);

export default route;