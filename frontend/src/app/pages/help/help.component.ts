import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { HelpService, HelpRequest } from '../../service/help.service';
import { InputTextarea } from 'primeng/inputtextarea';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-help',
  standalone: true,
  templateUrl: './help.component.html',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputTextarea,
    ButtonModule,
    PanelModule
  ]
})
export class HelpComponent {
  email: string = '';
  message: string = '';
  submitted: boolean = false;
  query: string = '';
  employeeQuerySubmitted: boolean = false;
  user: any = '';
  userRole: string = '';
  employeeQueries: any[] = [];
  responseMessage: string = '';

  constructor(
    private helpService: HelpService,
    private authService: AuthService
  ) {
    this.user = this.authService.getCurrentUser(); // e.g., 'Admin', 'Employee', etc.
    this.userRole = this.user.role; // e.g., 'Admin', 'Employee', etc.

    if (this.userRole === 'Admin' || this.userRole === 'Dept_User') {
      this.loadEmployeeQueries();
    }
  }

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

  loadEmployeeQueries() {
    this.employeeQueries = [
      { id: 1, employeeName: 'John Doe', query: 'How to reset password?', response: '' },
      { id: 2, employeeName: 'Jane Smith', query: 'How to access the dashboard?', response: '' },
    ];
  }

  replyToQuery(queryId: number, responseMessage: string) {
    const query = this.employeeQueries.find((q) => q.id === queryId);
    if (query) {
      query.response = responseMessage;
      this.responseMessage = '';
    }
  }
}
