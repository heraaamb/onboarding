import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../service/employee.service';
import { Employee } from '../../models/employee.model';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [CommonModule, PanelModule, CardModule, AvatarModule, FormsModule]
})
export class ProfileComponent implements OnInit {
  employee: Employee | null = null;
  employee_name: any;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser()
    console.log("user from profile component: ",user);
    this.loadProfile(user);
  }

  loadProfile(user:any) {
    // Fetch the employee data from the backend using the service
    this.employeeService.getEmployeeById(user.id).subscribe({
      next: (data: Employee) => {
        console.log("Data in the next function: ",data);
        this.employee = data;
      },
      error: (err: any) => {
        console.error('Error fetching employee profile:', err);
      }
    });
  }
}
