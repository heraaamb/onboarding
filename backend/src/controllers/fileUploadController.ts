import { saveFileMetadata } from '../services/DocumentUploadService';
import { Request, Response } from 'express';

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
      if (!req.file) {
          res.status(400).json({ message: 'No file uploaded.' });
          return;
      }

      const fileData = {
          filename: req.file.filename,
          path: req.file.path,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
      };

      await saveFileMetadata(fileData);

      res.status(200).json({
          message: 'File uploaded successfully',
          file: fileData
      });
  } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ message: 'File upload failed' });
  }
};
