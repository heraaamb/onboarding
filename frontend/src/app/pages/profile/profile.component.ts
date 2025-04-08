import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../service/employee.service';
import { Employee } from '../../models/employee.model';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [CommonModule, PanelModule, CardModule, AvatarModule, FormsModule]
})
export class ProfileComponent implements OnInit {
  employee: Employee | null = null;
employee_name: any;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadEmployeeProfile();
  }

  loadEmployeeProfile() {
    // Fetch the employee data from the backend using the service
    this.employeeService.getEmployeeById(1).subscribe({
      next: (data: Employee) => {
        this.employee = data;
      },
      error: (err: any) => {
        console.error('Error fetching employee profile:', err);
      }
    });
  }
}
