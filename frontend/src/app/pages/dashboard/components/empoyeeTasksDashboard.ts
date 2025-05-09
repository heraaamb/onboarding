import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import * as taskService from '../../../service/tasks.service';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../service/tasks.service';


// Define your interface
interface EmployeeTasks {
    employeeName: string;
    department: string;
    taskName: string;
}

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    template: `
    <div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Recent Employee Tasks</div>
        <p-table [value]="tasks" [paginator]="true" [rows]="5" responsiveLayout="scroll">
            <ng-template pTemplate="header">
                <tr>
                    <th pSortableColumn="employeeName">Employee <p-sortIcon field="employeeName"></p-sortIcon></th>
                    <th pSortableColumn="department">Department <p-sortIcon field="department"></p-sortIcon></th>
                    <th pSortableColumn="taskName">Task <p-sortIcon field="taskName"></p-sortIcon></th>
                    <th>Action</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-task>
                <tr>
                    <td>{{ task.employee_name }}</td>
                    <td>{{ task.department_name }}</td>
                    <td>{{ task.task_name }}</td>
                    <td>
                        <button pButton pRipple type="button" icon="pi pi-search" class="p-button p-button-text p-button-icon-only"></button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>
    `
})
export class EmployeeTasksDashboard implements OnInit {
    tasks: Task[] = [];
      constructor(
        private taskService: TaskService
    ) {}

    ngOnInit() {
        // Simulate fetching from a service
        this.loadTasks();
    }

    loadTasks(){
          this.taskService.getAllTasks().subscribe({
            next: (data: any) => {
                console.log("The tasks: ",data);
                 this.tasks = data;
            },
            error:  (err) => {
              console.error('Error fetching tasks:', err);
            },
        });
    }
}
