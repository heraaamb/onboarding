import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { HelpRequest } from '../../service/help.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpDialogComponent {
  @Input() visible: boolean = false;
  @Output() save = new EventEmitter<HelpRequest>();
  @Output() close = new EventEmitter<void>();

  email: string = '';
  message: string = '';

  submitForm() {
    if (this.email && this.message) {
      this.save.emit({ email: this.email, message: this.message });
      this.email = '';
      this.message = '';
    }
  }
}
