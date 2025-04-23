import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Task } from '../../models/task.model';
import { TaskService } from '../../service/tasks.service';
import { TaskDialogComponent } from './task-dialog.component'; // Assuming this is a popup component for add/edit
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-task',
  standalone: true,
  templateUrl: './tasks.component.html',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    TaskDialogComponent,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService]
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];

  departments = [
    { label: 'HR', value: 'HR' },
    { label: 'IT', value: 'IT' },
    { label: 'Operations', value: 'Operations' },
    { label: 'R&D', value: 'R&D' }
  ];
  

  selectedTask: Task = this.getEmptyTask();
  taskDialogVisible = false;
  newTask : Task = this.getEmptyTask();

  constructor(private taskService: TaskService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error:  (err) => {
        console.error('Error fetching tasks:', err);
      },
    });
  }

  openNewTaskDialog() {
    this.newTask = this.getEmptyTask();
    this.taskDialogVisible = true;
  }

  editTask(task: Task) {
    console.log("task: ", task);
    console.log('Editing task with department:', task.department_name);
    console.log('Dropdown values:', this.departments.map(d => d.value));

    task.fromEdit = true;
    this.selectedTask = { ...task ,
      due_date: typeof task.due_date === 'string' ? new Date(task.due_date) : task.due_date,
      department_name: task.department_name
    };
    this.taskDialogVisible = true;
  }

  addTask(newTask: Task) {
    if (newTask.fromEdit === true) {
      this.taskDialogVisible = true;
      this.taskService.editTask(newTask.task_id, newTask).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Task updated successfully!'
          });
          this.loadTasks();
          this.taskDialogVisible = false;
        },
        error: (error) => {
          console.error('Error editing task:', error);
          alert('Failed to edit task.');
        },
      });
    } else {
      this.taskService.addTask(newTask).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Task added successfully!'
          });
          // // Debugging
          // console.log('Task added successfully:', response);
          this.loadTasks();
          this.taskDialogVisible = false;
        },
        error: (error) => {
          console.error('Error adding task:', error);
          alert('Failed to add task.');
        },
      });
    }
  }

  deleteTask(task: Task) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this task?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Proceed with the deletion if the user confirms
        this.taskService.deleteTask(task.task_id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Task Deleted successfully!'
            });
            this.loadTasks(); // Refresh the task list
          },
          error: (error) => {
            console.error('Error deleting task:', error);
            alert('Failed to delete task.');
          }
        });
      },
      reject: () => {
        // Optionally handle rejection (optional for now)
        console.log('Task deletion canceled');
      }
    });
  }
  

  getEmptyTask(): Task {
    return {
      employee_name: '',
      assigned_by_name: '',
      department_name: '',
      task_id: 0,
      task_name: '',
      description: '',
      due_date: '',
      fromEdit: false
    };
  }
}
