import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonLabel, ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Employee } from '../../models/employee.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HOST_URL } from '../../utils/utils';

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
        TextareaModule,
        HttpClientModule,
    ],
    templateUrl: './employee-dialog.component.html'
})
export class EmployeeDialogComponent {
    @Input() visible: boolean = false;
    @Input() employee: Employee = {
        employee_name: '',
        email: '',
        department_name: '',
        joining_date: '',
        role: '',
        status: '',
        designation: '',
        supervisor_name: '',
        emp_id: 0,
        fromEdit: false
    };
    
    @Input() departments: any[] = [];
    @Output() save: EventEmitter<Employee> = new EventEmitter();
    @Output() close: EventEmitter<void> = new EventEmitter();
    

    roles = [
        { label: 'Employee', value: 'Employee' },
        { label: 'Admin', value: 'Admin' },
        { label: 'Department User', value: 'Dept_User' },
        { label: 'Supervisor', value: 'Supervisor' }
    ];

    statuses = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];

    supervisorOptions: any[] = [];

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.fetchSupervisors();
    }

    fetchSupervisors() {
        this.http.get<any[]>(`${HOST_URL}/api/users`).subscribe({
            next: (data) => {
                // Assuming each item has a name or employee_name
                this.supervisorOptions = data.map(user => ({
                    label: user.name,
                    value: user.name
                }));
            },
            error: (err) => {
                console.error('Error fetching supervisors:', err);
            }
        });
    }


    hideDialog() {
        this.close.emit();
    }

    saveEmployee() {
        this.save.emit(this.employee);
    }
    onClose() {
        this.close.emit();
    }
}
