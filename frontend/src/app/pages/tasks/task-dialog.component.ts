import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HOST_URL } from '../../utils/utils';


@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
    HttpClientModule,
  ]
})
export class TaskDialogComponent {
  @Input() visible: boolean = false;
  @Input() task: Task = {
    employee_name: '',
    assigned_by_name: '',
    department_name: '',
    task_name: '',
    description: '',
    due_date: '',
    task_id: 0,
    fromEdit: false
  };
  employeeOptions: any[] = [];
  assigned_by_nameOptions: any[] = [];
  constructor(private http: HttpClient) {}

  @Input() departments: { label: string; value: string }[] = [];

  @Output() save = new EventEmitter<Task>();
  @Output() close = new EventEmitter<void>();
  assigned_by: any[]|undefined;

  ngOnInit() {
    this.fetchemployeeOptions();
    this.fetchassigned_by_nameOptions();
  }

  fetchemployeeOptions() {
    this.http.get<any[]>(`${HOST_URL}/api/employees`).subscribe({
        next: (data) => {
            // Assuming each item has a name or employee_name
            this.employeeOptions = data.map(user => ({
                label: user.employee_name,
                value: user.employee_name
            }));
        },
        error: (err) => {
            console.error('Error fetching employees:', err);
        }
    });
  }
  fetchassigned_by_nameOptions() {
    this.http.get<any[]>(`${HOST_URL}/api/users`).subscribe({
        next: (data) => {
            // Assuming each item has a name or employee_name
            this.assigned_by_nameOptions = data.map(user => ({
                label: user.name,
                value: user.name
            }));
        },
        error: (err) => {
            console.error('Error fetching assigned_by_nameOptions:', err);
        }
    });
  }

  onSave() {
    this.save.emit(this.task);
  }

  onClose() {
    this.close.emit();
  }
}
