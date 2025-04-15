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

<<<<<<< HEAD
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
=======
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
>>>>>>> 1669103b6b7ebc1c0c654c62022a79ee7d7851d1
            this.employeeService.updateEmployee(newEmployee.emp_id, newEmployee).subscribe({
                next: (response) => {
                    console.log('Employee updated successfully:', response);
                    alert('Employee updated successfully!');
                    this.loadEmployees();
<<<<<<< HEAD
                    this.employeeDialogVisible = false;
                },
                error: (error) => {
                    console.error('Error adding employee:', error);
                    alert('Failed to update employee.');
                }
            });
        }
        else {
=======
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
>>>>>>> 1669103b6b7ebc1c0c654c62022a79ee7d7851d1
            this.employeeService.addEmployee(newEmployee).subscribe({
                next: (response) => {
                    console.log('Employee added successfully:', response);
                    alert('Employee added successfully!');
                    this.loadEmployees();
<<<<<<< HEAD
                    this.employeeDialogVisible = false;
=======
                    this.employeeDialogVisible = false; 
>>>>>>> 1669103b6b7ebc1c0c654c62022a79ee7d7851d1
                },
                error: (error) => {
                    console.error('Error adding employee:', error);
                    alert('Failed to add employee.');
                }
            });
        }
<<<<<<< HEAD
        
=======
>>>>>>> 1669103b6b7ebc1c0c654c62022a79ee7d7851d1
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
<<<<<<< HEAD
            employee_name: '',
            email: '',
=======
            emp_id: 0,
            name: undefined,
            email: undefined,
>>>>>>> 1669103b6b7ebc1c0c654c62022a79ee7d7851d1
            department_name: '',
            joining_date: '',
            role: '',
            status: '',
            designation: '',
<<<<<<< HEAD
            supervisor_name: '',
            emp_id: 0
=======
            supervisor_name: undefined,
            fromEdit: false
>>>>>>> 1669103b6b7ebc1c0c654c62022a79ee7d7851d1
        };
    }
}
