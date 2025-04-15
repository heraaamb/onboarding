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
import { MessageService } from 'primeng/api';


@Component({
    selector: 'app-employee-list',
    standalone: true,
    templateUrl: './employee-list.component.html',
    providers: [MessageService],
    
    imports: [CommonModule, FormsModule, TableModule, ButtonModule,ToolbarModule,EmployeeDialogComponent ,ToastModule]
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

    newEmployee: Employee = this.getEmptyEmployee();

    constructor(
        private employeeService: EmployeeService,
        private messageService: MessageService
      ) {}
      

    ngOnInit() {
        this.loadEmployees();
    }

    loadEmployees() {
        this.employeeService.getAllEmployees().subscribe({
            next: (data) => {
                this.employees = data;
            },
            error: (err) => {
                console.error('Error fetching employees:', err);
            }
        });
    }

    openNewEmployeeDialog() {
        this.newEmployee = this.getEmptyEmployee();
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
        if (newEmployee.fromEdit === true) {
          this.employeeDialogVisible = true;
          this.employeeService.updateEmployee(newEmployee.emp_id, newEmployee).subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Employee updated successfully!'
              });
              this.loadEmployees();
              this.employeeDialogVisible = false;
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update employee.'
              });
            }
          });
        } else {
          this.employeeService.addEmployee(newEmployee).subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Employee added successfully!'
              });
              this.loadEmployees();
              this.employeeDialogVisible = false;
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add employee.'
              });
            }
          });
        }
      }
      

    deleteEmployee(employee: Employee) {
        this.employeeService.deleteEmployee(employee.emp_id).subscribe({
            next: () => {
                this.loadEmployees();
                alert('Employee deleted successfully!');
            },
            error: (error) => {
                console.error('Error deleting employee:', error);
                alert('Failed to delete employee.');
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
