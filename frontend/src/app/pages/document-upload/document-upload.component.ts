import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule],
  providers: [MessageService],
})
export class DocumentUploadComponent {
    uploadedFiles: File[] = [];

    constructor(private messageService: MessageService) {}

    // Method to handle file upload event
    uploadFiles(event: { files: File[] }) {
        
    }

    onUpload(event: { files: File[] }) {
        this.uploadedFiles.push(...event.files);

        this.messageService.add({
            severity: 'info',
            summary: 'Upload Success',
            detail: `${event.files.length} file(s) uploaded.`,
        });
    }
}
