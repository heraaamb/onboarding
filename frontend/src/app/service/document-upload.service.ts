import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HOST_URL } from '../utils/utils';

@Injectable({
    providedIn: 'root'
})
export class DocumentUploadService {
    private apiUrl = `${HOST_URL}/api/document-upload`;

    constructor(private http: HttpClient) {}

    // Upload a single file
    uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file); // Match multer.single('file')

        return this.http.post(`${this.apiUrl}/upload`, formData, {
            reportProgress: true,
            observe: 'events'
        });
    }

    // If you plan to support multiple file uploads, you'll need to change the backend
    uploadMultipleFiles(files: File[]): Observable<any> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('file', file); // Use same key if backend uses multer.array('file')
        });

        return this.http.post(`${this.apiUrl}/upload`, formData, {
            reportProgress: true,
            observe: 'events'
        });
    }

    getFiles(): Observable<any> {
        return this.http.get(`${this.apiUrl}/files`);
    }
}
