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
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        ToolbarModule,
        EmployeeDialogComponent
    ]
})
export class EmployeeListComponent implements OnInit {
    employees: Employee[] = []; // Initialize employees array

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

    updateEmployee(employee: Employee) {
        // // Debugging
        console.log("employee from edit: " ,employee);
        employee.fromEdit = true;
        this.selectedEmployee = { ...employee };
        this.employeeDialogVisible = true;
    }

    addEmployee(newEmployee: Employee) {
        if (newEmployee.fromEdit === true) {
            // // Debugging
            console.log("from edit employee: " , newEmployee);
            this.employeeDialogVisible = true;
            this.employeeService.updateEmployee(newEmployee.emp_id, newEmployee).subscribe({
                next: (response) => {
                    console.log('Employee updated successfully:', response);
                    alert('Employee updated successfully!');
                    this.loadEmployees();
                    this.employeeDialogVisible = false; 
                },
                error: (error) => {
                    console.log('Error updating employee:', error);
                    alert('Failed to update employee.');
                }
            })
        } 
        else {
            console.log("from add New Employee employee: " , newEmployee);
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
        this.employeeService.deleteEmployee(employee.email).subscribe({
            next: () => {
                this.employees = this.employees.filter(e => e.email !== employee.email);
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
            emp_id: 0,
            name: undefined,
            email: undefined,
            department_name: '',
            joining_date: '',
            role: '',
            status: '',
            designation: '',
            supervisor_name: undefined,
            fromEdit: false
        };
    }
}
