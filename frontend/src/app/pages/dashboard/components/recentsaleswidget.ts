import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

// Define your interface
interface EmployeeTask {
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
        <p-table [value]="employeeTasks" [paginator]="true" [rows]="5" responsiveLayout="scroll">
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
                    <td>{{ task.employeeName }}</td>
                    <td>{{ task.department }}</td>
                    <td>{{ task.taskName }}</td>
                    <td>
                        <button pButton pRipple type="button" icon="pi pi-search" class="p-button p-button-text p-button-icon-only"></button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>
    `
})
export class RecentSalesWidget implements OnInit {
    employeeTasks: EmployeeTask[] = [];

    ngOnInit() {
        // Simulate fetching from a service
        this.employeeTasks = [
            { employeeName: 'Alice Johnson', department: 'HR', taskName: 'Onboarding Documents' },
            { employeeName: 'Bob Smith', department: 'IT', taskName: 'Laptop Setup' },
            { employeeName: 'Carol White', department: 'Finance', taskName: 'Expense Report Review' },
            { employeeName: 'David Lee', department: 'Admin', taskName: 'Office Access' },
            { employeeName: 'Eve Black', department: 'Project', taskName: 'Project Briefing' }
        ];
    }
}
