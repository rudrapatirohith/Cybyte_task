import multer from 'multer';
import path from 'path';

// Define the uploads directory using an absolute path
const uploadsDir = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir); // Directory where files are saved
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); // Ensure unique filenames
    }
  });

export const upload = multer({ storage });
