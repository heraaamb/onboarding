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
    task_id: 0,
    fromEdit: false
  };
  employeeOptions = [
    { label: 'Nick Fury', value: 'Nick Fury' },
    { label: 'Maria Hill', value: 'Maria Hill' },
    { label: 'Peter Parker', value: 'Peter Parker' },
    { label: 'Steve Rogers', value: 'Steve Rogers' },
    { label: 'Wanda Maximoff', value: 'Wanda Maximoff' },
   
  ];

 taskOptions = [
    { label: 'R&D Policies', value: 'R&D Policies' },
    { label: 'Intro to Stark Tech', value: 'Intro to Stark Tech' },
    { label: 'Operations Briefing', value: 'Operations Briefing' },
    { label: 'HR Documentation', value: 'HR Documentation' },
    { label: 'Developing software', value: 'Developing software' },
   
  ];

  assigned_by_nameOptions = [
    { label: 'Nick Fury', value: 'Nick Fury' },
    { label: 'Maria Hill', value: 'Maria Hill' },
    { label: 'Peter Parker', value: 'Peter Parker' },
    { label: 'Steve Rogers', value: 'Steve Rogers' },
    { label: 'Wanda Maximoff', value: 'Wanda Maximoff' },
  ]


  

  @Input() departments: { label: string; value: string }[] = [];

  @Output() save = new EventEmitter<Task>();
  @Output() close = new EventEmitter<void>();
assigned_by: any[]|undefined;


  onSave() {
    this.save.emit(this.task);
  }

  onClose() {
    this.close.emit();
  }
}
