import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

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
    task_id: 0
  };

  @Input() departments: { label: string; value: string }[] = [];

  @Output() save = new EventEmitter<Task>();
  @Output() close = new EventEmitter<void>();

  onSave() {
    this.save.emit(this.task);
  }

  onClose() {
    this.close.emit();
  }
}
