import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { InputTextarea } from 'primeng/inputtextarea';
import { HelpService, HelpRequest } from '../../service/help.service';
import { AuthService } from '../../service/auth.service';

// ✅ Define the proper interface for employee queries
interface EmployeeQuery {
  query_id: number;
  employee_name: string;
  query_text: string;
  response?: string;
  responseMessage?: string;
}

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
  message: string = '';
  submitted: boolean = false;
  user: any = '';
  userRole: string = '';
  employeeQueries: EmployeeQuery[] = []; // ✅ Typed correctly
  loading: boolean = false;
  response:any;

  constructor(
    private helpService: HelpService,
    private authService: AuthService
  ) {
    this.user = this.authService.getCurrentUser();
    this.userRole = this.user.role;

    // Load queries based on role
    if (this.userRole === 'Admin' || this.userRole === 'Dept_User') {
      this.loadEmployeeQueries();
    } else if (this.userRole === 'Employee') {
      this.loadEmployeeQueriesForEmployee();
    }
  }

  submitForm() {
    if (this.message.trim()) {
      const helpRequest: HelpRequest = {
        emp_id: this.user.emp_id,
        query_text: this.message
      };

      this.helpService.submitHelpRequest(helpRequest).subscribe({
        next: () => {
          this.submitted = true;
          this.message = '';
          setTimeout(() => (this.submitted = false), 3000);
          this.loadEmployeeQueriesForEmployee();
        },
        error: (err) => {
          console.error('Error submitting help request:', err);
        }
      });
    }
  }

  loadEmployeeQueries() {
    this.loading = true;
    this.helpService.getAllOpenEmployeeQueries().subscribe({
      next: (data: EmployeeQuery[]) => {
        this.employeeQueries = data.map((query) => ({
          ...query,
          responseMessage: ''
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching employee queries:', err);
        this.loading = false;
      }
    });
  }

    loadEmployeeQueriesForEmployee() {
    this.loading = true;
    this.helpService.getEmployeeQueriesByEmpID(this.user.emp_id).subscribe({
      next: (data: EmployeeQuery[]) => {
        // Sort by descending query_id (newest first)
        this.employeeQueries = data
          .sort((a, b) => b.query_id - a.query_id);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching employee queries:', err);
        this.loading = false;
      }
    });
  }


  replyToQuery(queryId: number) {
    const query = this.employeeQueries.find((q) => q.query_id === queryId);
    if (query && query.responseMessage?.trim()) {
      this.helpService.replyToHelpRequest(queryId, query.responseMessage).subscribe({
        next: () => {
          query.response = query.responseMessage;
          query.responseMessage = '';
        },
        error: (err) => {
          console.error('Error sending reply:', err);
        }
      });
    }
  }
}
