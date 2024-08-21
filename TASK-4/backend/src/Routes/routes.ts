import express from 'express';
import { forgotPassword, insertData, insertDataTest, loginUser, logoutUser, resetPassword, Signup, updateDataTest } from '../Controllers/controllers';
import { authenticateJWT } from '../Middleware/jwttoken';
import { selectDatabse } from '../Middleware/selectDatabase';
import multer from 'multer';

const route = express.Router();
const upload = multer({dest: 'uploads/' });

// Routes
route.post('/signup',selectDatabse, Signup);

route.post('/login',selectDatabse, loginUser);

route.post('/insert-data',selectDatabse, authenticateJWT, insertData);

route.post('/logout',selectDatabse, logoutUser);

route.post('/forgot-password',selectDatabse, forgotPassword);

route.post('/reset-password',selectDatabse, resetPassword);

route.post('/insert-data-test',authenticateJWT, selectDatabse, upload.fields([
    { name: 'pdf_file', maxCount: 1 },
    { name: 'image_file', maxCount: 1 }
  ]), insertDataTest);

route.post('/update-data-test/:id', selectDatabse, upload.fields([
    { name: 'pdf_file', maxCount: 1 },
    { name: 'image_file', maxCount: 1 }
  ]), updateDataTest);

export default route;