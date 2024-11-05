import express from 'express';
// import { deleteData, forgotPassword, getData, getDataById, insertData, loginUser, logoutUser, resetPassword, Signup, updateData } from '../Controllers/controllers';
import { authenticateJWT } from '../Middleware/jwttoken';
import { selectDatabase } from '../Middleware/selectDatabase';
import path from 'path';
import { serveFile } from '../Middleware/serveFile';
import { upload } from '../Middleware/multerConfig';
import { forgotPassword, loginUser, logoutUser, resetPassword, Signup } from '../Controllers/userControllers';
import { deleteData, getAllData, getDataById, insertData, updateData } from "../Controllers/formController";
import { getAllFormDataInfo } from '../Controllers/homeController';
import { selectDb } from '../Middleware/selectdb';

const route = express.Router();


// Routes
// route.post('/signup',selectDatabase, Signup);

// route.post('/login',selectDatabase, loginUser);

// route.post('/logout',selectDatabase, logoutUser);

// route.post('/forgot-password',selectDatabase, forgotPassword);

// route.post('/reset-password',selectDatabase, resetPassword);

// route.post('/insert-data',authenticateJWT, selectDatabase, upload.fields([
//     { name: 'pdf_file', maxCount: 1 },
//     { name: 'image_file', maxCount: 1 }
//   ]), insertData);

// // Update data route
// route.put('/records/:id', authenticateJWT, selectDatabase, upload.fields([
//   { name: 'pdf_file', maxCount: 1 },
//   { name: 'image_file', maxCount: 1 }
// ]), updateData);

// route.get('/records/:id', authenticateJWT, selectDatabase, getDataById);

// // Get data route
// route.get('/records', authenticateJWT, selectDatabase, getData);

// // Delete data route
// route.delete('/records/:id', authenticateJWT, selectDatabase, deleteData);


// // Route to serve files
// route.get('/file/:filename', (req, res) => {
//   const filename = req.params.filename;
//   const filePath = path.join(__dirname, '../../uploads', filename);
//   serveFile(res, filePath); // Use the utility function
// });


route.post('/signup', selectDatabase, Signup);
route.post('/login', selectDatabase, loginUser);
route.post('/logout', selectDatabase, logoutUser);
route.post('/forgot-password', selectDatabase, forgotPassword);
route.post('/reset-password', selectDatabase, resetPassword);

// Form routes
route.post('/insert-data', authenticateJWT, selectDatabase, upload.fields([
  { name: 'pdf_file', maxCount: 1 },
  { name: 'image_file', maxCount: 1 }
]), insertData);

route.put('/records/:id', authenticateJWT, selectDatabase, upload.fields([
  { name: 'pdf_file', maxCount: 1 },
  { name: 'image_file', maxCount: 1 }
]), updateData);

route.get('/records/:id', authenticateJWT, selectDatabase, getDataById);
route.get('/records', authenticateJWT, selectDatabase, getAllData);
route.delete('/records/:id', authenticateJWT, selectDatabase, deleteData);

// Route to serve files
route.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads', filename);
  serveFile(res, filePath); // Use the utility function
});


route.get('/home', selectDb , getAllFormDataInfo);

export default route;