import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HOST_URL } from '../utils/utils';

@Injectable({
    providedIn: 'root'
})
export class DocumentUploadService {
   
    private apiUrl = `${HOST_URL}/api/document`;

    constructor(private http: HttpClient) { }

    uploadFiles(files: File[]): Observable<any> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file, file.name);
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
