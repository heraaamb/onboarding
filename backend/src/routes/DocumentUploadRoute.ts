import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure the destination folder exists
const uploadDir = path.join(__dirname, '../../document-uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.array('file', 10), (req, res) => {
    console.log('Uploaded files:', req.files);
    console.log('Form body:', req.body);

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ message: 'No files received' });
    }

    res.status(200).json({
        message: 'Files uploaded successfully',
        files: req.files,
    });
});

export default router;
