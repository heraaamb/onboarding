import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../service/employee.service';
import { Employee } from '../../models/employee.model';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    CommonModule,
    PanelModule,
    CardModule,
    AvatarModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class ProfileComponent implements OnInit {
  employee: Employee | null = null;

  // Password form fields
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showChangePassword: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    console.log("user from profile component: ", user);
    this.loadProfile(user);
  }

  loadProfile(user: any) {
    this.employeeService.getEmployeeById(user.id).subscribe({
      next: (data: Employee) => {
        console.log("Data in the next function: ", data);
        if (typeof data.joining_date === 'string') {
          data.joining_date = new Date(data.joining_date);
        }
        this.employee = data;
      },
      error: (err: any) => {
        console.error('Error fetching employee profile:', err);
      }
    });
  }

  // Getter for formatted date
  get formattedJoiningDate(): string {
    if (this.employee?.joining_date) {
      return this.employee.joining_date instanceof Date ? 
        this.employee.joining_date.toISOString().split('T')[0] : '';
    }
    return 'Not Available';
  }

  // Change password method
  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'New passwords do not match.'
      });
      return;
    }

    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password updated successfully.'
        });
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.showChangePassword = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to change password.'
        });
      }
    });
  }
}
