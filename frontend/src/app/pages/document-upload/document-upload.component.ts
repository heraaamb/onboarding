import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DocumentUploadService } from '../../service/document-upload.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule],
  providers: [MessageService],
})
export class DocumentUploadComponent {
  uploadedFiles: File[] = [];

  constructor(
    private readonly messageService: MessageService,
    private readonly documentUploadService: DocumentUploadService
  ) {}

  onUpload(event: { files: File[] }): void {
    const filesToUpload = event.files;

    if (!filesToUpload || filesToUpload.length === 0) {
      this.showMessage('warn', 'No Files', 'Please select files to upload.');
      return;
    }

    this.documentUploadService.uploadMultipleFiles(filesToUpload).subscribe({
      next: () => {
        this.uploadedFiles = filesToUpload;
        this.showMessage(
          'success',
          'Upload Success',
          `${filesToUpload.length} file(s) uploaded successfully.`
        );
      },
      error: (err: any) => {
        console.error('Upload error:', err);
        this.showMessage('error', 'Upload Failed', 'An error occurred during file upload.');
      }
    });
  }

  private showMessage(
    severity: 'success' | 'info' | 'warn' | 'error',
    summary: string,
    detail: string
  ): void {
    this.messageService.clear(); // Clear previous toasts
    this.messageService.add({ severity, summary, detail });
  }
  
}
