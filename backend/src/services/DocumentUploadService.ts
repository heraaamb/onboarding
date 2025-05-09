import path from 'path';

export const uploadFile = async (file: Express.Multer.File) => {
  return {
    filename: file.filename,
    originalname: file.originalname,
    path: file.path,
    mimetype: file.mimetype,
    size: file.size,
    extension: path.extname(file.originalname),
  };
};
