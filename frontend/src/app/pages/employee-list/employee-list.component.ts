import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../service/employee.service';
import { EmployeeDialogComponent } from '../employee-list/employee-dialog.component';
import { ToastModule } from 'primeng/toast';
import {ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../service/auth.service';


@Component({
    selector: 'app-employee-list',
    standalone: true,
    templateUrl: './employee-list.component.html',
    providers: [MessageService,ConfirmationService],
    
    imports: [
      CommonModule, 
      FormsModule, 
      TableModule, 
      ButtonModule,
      ToolbarModule,
      EmployeeDialogComponent ,
      ToastModule, 
      ConfirmDialogModule]
})
export class EmployeeListComponent implements OnInit {
    employees: Employee[] = [];
    departments = [
        { name: 'HR', value: 'HR' },
        { name: 'Operations', value: 'Operations' },
        { name: 'IT', value: 'IT' },
        { name: 'R&D', value: 'R&D' },
        { name: 'Marketing', value: 'Marketing' }
    ];

    selectedEmployee: Employee = this.getEmptyEmployee();
    employeeDialogVisible = false;

    constructor(
        private employeeService: EmployeeService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private authService: AuthService,
      ) {}    

    ngOnInit() {
      const user = this.authService.getCurrentUser()
      this.loadEmployees(user);
    }

    loadEmployees(user: any) {
      if (!user || !user.role) {
        console.error('Invalid user data.');
        return;
      }
    
      if (user.role === 'Admin') {
        this.employeeService.getAllEmployees().subscribe({
          next: (data) => {
            this.employees = data;
          },
          error: (err) => {
            console.error('Error fetching all employees:', err);
          }
        });
      } else if (user.role === 'Dept_User' && user.department_id) {
        // // Debugging
        // console.log(user.department_id);
        this.employeeService.getEmployeesByDeptId(user.department_id).subscribe({
          next: (data) => {
            // // Debugging
            console.log("data recieved in employee component", data);
            this.employees = data;
          },
          error: (err) => {
            console.error(`Error fetching employees for department_id ${user.department_id}:`, err);
          }
        });
      } else {
        console.warn('User role is not allowed to load employees or missing department_id.');
      }
    }
    

    openNewEmployeeDialog() {
      this.selectedEmployee = this.getEmptyEmployee(); // reset to empty
      this.employeeDialogVisible = true;
    }
    

    updateEmployee(employee: Employee) {
        // // Debugging
        // console.log("employee from edit: " ,employee);
        
        employee.fromEdit = true;
        this.selectedEmployee = { 
            ...employee , 
            joining_date: typeof employee.joining_date === 'string' ? new Date(employee.joining_date) : employee.joining_date,
        };
        this.employeeDialogVisible = true;
    }

    addEmployee(newEmployee: Employee) {
      // // Debugging
      // console.log(newEmployee);  
    
      if (newEmployee.fromEdit === true) {
        this.employeeDialogVisible = true;
        this.employeeService.updateEmployee(newEmployee.emp_id, newEmployee).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Employee updated successfully!'
            });
            const user = this.authService.getCurrentUser()
            this.loadEmployees(user);
            this.employeeDialogVisible = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Failed to update employee: ${error}`
            });
          }
        });
      } else {
        this.employeeService.addEmployee(newEmployee).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Employee added successfully!'
            });
            const user = this.authService.getCurrentUser()
            this.loadEmployees(user);
            this.employeeDialogVisible = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Failed to add employee: ${error.error.error}`
            });
            // // Debugging
            console.log("this is the error in creating empoyee: ",error.error.error);
          }
        });
      }
    }
    
      

    deleteEmployee(employee: Employee) {
      this.confirmationService.confirm({
        message: `Are you sure you want to delete ${employee.employee_name}?`,
        header: 'Confirm Delete',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.employeeService.deleteEmployee(employee.emp_id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Employee deleted successfully!'
              });
              const user = this.authService.getCurrentUser()
              this.loadEmployees(user); // refresh list
            },
            error: (error) => {
              console.error('Error deleting employee:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete employee.'
              });
            }
          });
        }
      });
    }
    
    

    getEmptyEmployee(): Employee {
        return {
            employee_name: '',
            email: '',
            department_name: '',
            joining_date: '',
            role: '',
            status: '',
            designation: '',
            supervisor_name: undefined,
            emp_id: 0,
            fromEdit: false
        };
    }
}
