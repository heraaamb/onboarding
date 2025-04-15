import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../service/employee.service';
import { EmployeeDialogComponent } from '../employee-list/employee-dialog.component';

@Component({
    selector: 'app-employee-list',
    standalone: true,
    templateUrl: './employee-list.component.html',
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, ToolbarModule, EmployeeDialogComponent]
})
export class EmployeeListComponent implements OnInit {
editEmployee(_t52: any) {
throw new Error('Method not implemented.');
}
    employees: Employee[] = []; // Initialize employees array
    isEdit = false;
    departments = [
        { name: 'HR', value: 'HR' },
        { name: 'Finance', value: 'Finance' },
        { name: 'IT', value: 'IT' },
        { name: 'R&D', value: 'R&D' },
        { name: 'Marketing', value: 'Marketing' }
    ];

    selectedEmployee: Employee = this.getEmptyEmployee();
    employeeDialogVisible = false;

    newEmployee: Employee = this.getEmptyEmployee();

    constructor(private employeeService: EmployeeService) {}

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

    // editEmployee(employee: Employee) {
    //     this.isEdit=true;
    //     this.selectedEmployee = {} as Employee;
    //     this.selectedEmployee = employee;
    //     console.log(this.selectedEmployee);
    //     this.employeeDialogVisible = true;
    // }

    updateEmployee(){
        this.employeeService.updateEmployee(this.newEmployee.emp_id, this.newEmployee).subscribe({
            next: (response) => {
                console.log('Employee added successfully:', response);
                alert('Employee added successfully!');
                this.loadEmployees();
                this.employeeDialogVisible = false;
            },
            error: (error) => {
                console.error('Error adding employee:', error);
                alert('Failed to add employee.');
            }
        });  
    }

    addEmployee(newEmployee: Employee) {
        if (this.isEdit ){
            this.employeeService.updateEmployee(newEmployee.emp_id, newEmployee).subscribe({
                next: (response) => {
                    console.log('Employee updated successfully:', response);
                    alert('Employee updated successfully!');
                    this.loadEmployees();
                    this.employeeDialogVisible = false;
                },
                error: (error) => {
                    console.error('Error adding employee:', error);
                    alert('Failed to update employee.');
                }
            });
        }
        else {
            this.employeeService.addEmployee(newEmployee).subscribe({
                next: (response) => {
                    console.log('Employee added successfully:', response);
                    alert('Employee added successfully!');
                    this.loadEmployees();
                    this.employeeDialogVisible = false;
                },
                error: (error) => {
                    console.error('Error adding employee:', error);
                    alert('Failed to add employee.');
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
            supervisor_name: '',
            emp_id: 0
        };
    }
}
