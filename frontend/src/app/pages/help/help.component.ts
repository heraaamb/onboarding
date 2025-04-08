import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { HelpService, HelpRequest } from '../../service/help.service';
import { InputTextarea } from 'primeng/inputtextarea';

@Component({
  selector: 'app-help',
  standalone: true,
  templateUrl: './help.component.html',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputTextarea, // ✅ correct way to import
    ButtonModule,
    PanelModule
  ]
})
export class HelpComponent {
  email: string = '';
  message: string = '';
  submitted: boolean = false;

  constructor(private helpService: HelpService) {}

  submitForm() {
    if (this.email && this.message) {
      const helpRequest: HelpRequest = {
        email: this.email,
        message: this.message
      };

      this.helpService.submitHelpRequest(helpRequest).subscribe({
        next: () => {
          this.submitted = true;
          this.email = '';
          this.message = '';
        },
        error: (err) => {
          console.error('Error submitting help request:', err);
        }
      });
    }
  }
}
