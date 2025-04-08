import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Employee } from '../../models/employee.model';

@Component({
    selector: 'app-employee-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        DropdownModule,
        CalendarModule,
        ButtonModule,
        InputTextModule,
        TextareaModule
    ],
    templateUrl: './employee-dialog.component.html'
})
export class EmployeeDialogComponent {
    @Input() visible: boolean = false;
    @Input() employee: Employee = {
        name: '',
        email: '',
        department_name: '',
        joining_date: '',
        role: '',
        status: '',
        designation: '',
        supervisor_name: ''
    };

    @Input() departments: any[] = [];
    @Output() save: EventEmitter<Employee> = new EventEmitter();
    @Output() close: EventEmitter<void> = new EventEmitter();

    roles = [
        { label: 'Employee', value: 'Employee' },
        { label: 'Admin', value: 'Admin' },
        { label: 'Department User', value: 'Department User' },
        { label: 'R&D', value: 'R&D' },
        { label: 'Supervisor', value: 'Supervisor' }
    ];

    statuses = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];

    hideDialog() {
        this.close.emit();
    }

    saveEmployee() {
        this.save.emit(this.employee);
    }
}
