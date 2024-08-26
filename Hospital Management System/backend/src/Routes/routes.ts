import express from 'express';
import { deleteData, forgotPassword, getData, getDataById, insertData, loginUser, logoutUser, resetPassword, Signup, updateData } from '../Controllers/controllers';
import { authenticateJWT } from '../Middleware/jwttoken';
import { selectDatabase } from '../Middleware/selectDatabase';
import multer from 'multer';

const route = express.Router();
const upload = multer({dest: 'uploads/' });

// Routes
route.post('/signup',selectDatabase, Signup);

route.post('/login',selectDatabase, loginUser);

route.post('/logout',selectDatabase, logoutUser);

route.post('/forgot-password',selectDatabase, forgotPassword);

route.post('/reset-password',selectDatabase, resetPassword);

route.post('/insert-data',authenticateJWT, selectDatabase, upload.fields([
    { name: 'pdf_file', maxCount: 1 },
    { name: 'image_file', maxCount: 1 }
  ]), insertData);

// Update data route
route.put('/records/:id', authenticateJWT, selectDatabase, upload.fields([
  { name: 'pdf_file', maxCount: 1 },
  { name: 'image_file', maxCount: 1 }
]), updateData);

route.get('/records/:id', authenticateJWT, selectDatabase, getDataById);

// Get data route
route.get('/records', authenticateJWT, selectDatabase, getData);

// Delete data route
route.delete('/records/:id', authenticateJWT, selectDatabase, deleteData);

export default route;