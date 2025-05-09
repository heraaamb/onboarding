import { Request, Response } from 'express';
import * as fileUploadService from '../services/DocumentUploadService';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const { files } = req.body; 
    const file = req.file; // Correct way to access the uploaded file from multer
    console.log('File:', file); // Log the file object for debugging

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await fileUploadService.uploadFile(file);
    res.status(200).json({ message: 'File uploaded successfully', data: result });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};
