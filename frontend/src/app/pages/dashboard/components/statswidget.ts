import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../service/stats.service'; // Adjust path as needed
import { forkJoin } from 'rxjs';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Employees</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                        {{ employeeCount ?? 'Loading...' }}
                        <span *ngIf="employeeError" class="text-red-500 text-sm">(Failed to load)</span>
                    </div>
                </div>
                <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-users text-blue-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">4 new </span>
            <span class="text-muted-color">since last visit</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Tasks</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                        {{ taskCount ?? 'Loading...' }}
                        <span *ngIf="taskError" class="text-red-500 text-sm">(Failed to load)</span>
                    </div>
                </div>
                <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-check-square text-orange-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">%52+ </span>
            <span class="text-muted-color">since last week</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Departments</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                        {{ departmentCount ?? 'Loading...' }}
                        <span *ngIf="departmentError" class="text-red-500 text-sm">(Failed to load)</span>
                    </div>
                </div>
                <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-sitemap text-cyan-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">1 </span>
            <span class="text-muted-color">newly registered</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Comments</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152 Unread</div>
                </div>
                <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-comment text-purple-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">85 </span>
            <span class="text-muted-color">responded</span>
        </div>
    </div>`
})
export class StatsWidget implements OnInit {
    employeeCount: any | null = null;
    taskCount: any | null = null;
    departmentCount: any | null = null;
    
    employeeError = false;
    taskError = false;
    departmentError = false;
    
    isLoading = true;

    constructor(private statsService: StatsService) {}

    ngOnInit() {
        forkJoin({
            employees: this.statsService.getEmployeeCount(),
            tasks: this.statsService.getTaskCount(),
            departments: this.statsService.getDepartmentsCount()
        }).subscribe({
            next: ({employees, tasks, departments}) => {
                this.employeeCount = employees;
                this.taskCount = tasks;
                this.departmentCount = departments;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading stats:', err);
                this.isLoading = false;
                // Handle individual errors if needed
            }
        });
        
        // Alternative: Parallel requests with individual error handling
        this.loadEmployeeCount();
        this.loadTaskCount();
        this.loadDepartmentCount();
    }

    private loadEmployeeCount() {
        this.statsService.getEmployeeCount().subscribe({
            next: (count) => {
                this.employeeCount = count.total_employees;
            },
            error: (err) => {
                console.error('Failed to load employee count', err);
                this.employeeError = true;
            }
        });
    }
    

    private loadTaskCount() {
        this.statsService.getTaskCount().subscribe({
            next: (count) => this.taskCount = count.total_tasks,
            error: (err:any) => {
                console.error('Failed to load task count', err);
                this.taskError = true;
            }
        });
    }

    private loadDepartmentCount() {
        this.statsService.getDepartmentsCount().subscribe({
            next: (count) => this.departmentCount = count.total_departments,
            error: (err) => {
                console.error('Failed to load department count', err);
                this.departmentError = true;
            }
        });
    }
}