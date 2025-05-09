import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/fileUploadController';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(__dirname, 'document-uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const router = express.Router();
const storage = multer.diskStorage({
    destination: 'document-uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
  });
  
const upload = multer({ storage });

  
// Define the route for file upload
router.post('/upload', upload.single('file'), uploadFile);

export default router; 