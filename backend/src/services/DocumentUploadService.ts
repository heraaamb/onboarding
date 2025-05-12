import fs from 'fs';

export interface FileMetadata {
  filename: string;
  path: string;
  originalname: string;
  mimetype: string;
  size: number;
}

// Example: You could store this in a DB instead

export const saveFileMetadata = async (fileData: FileMetadata): Promise<void> => {
    const metadataFile = 'document-uploads/metadata.json';

    let existing: FileMetadata[] = [];
    if (fs.existsSync(metadataFile)) {
        const data = fs.readFileSync(metadataFile, 'utf-8');
        existing = JSON.parse(data);
    }

    existing.push(fileData);
    fs.writeFileSync(metadataFile, JSON.stringify(existing, null, 2));
};