import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Task } from '../../models/task.model';
import { TaskService } from '../../service/tasks.service';
import { TaskDialogComponent } from './task-dialog.component'; // Assuming this is a popup component for add/edit

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
  ],
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];

  departments = [
    { label: 'HR', value: 'HR' },
    { label: 'IT', value: 'IT' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Admin', value: 'Admin' }
  ];
  

  selectedTask: Task = this.getEmptyTask();
  taskDialogVisible = false;
  newTask : Task = this.getEmptyTask();

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAlltasks().subscribe({
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
    task.fromEdit = true;
    this.selectedTask = { ...task };
    this.taskDialogVisible = true;
  }

  addTask(newTask: Task) {
    if (newTask.fromEdit === true) {
      this.taskService.editTask(newTask.task_id, newTask).subscribe({
        next: (response) => {
          console.log('Task edited successfully:', response);
          alert('Task edited successfully!');
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
        next: (response) => {
          console.log('Task added successfully:', response);
          alert('Task added successfully!');
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
    this.taskService.deleteTask(task.task_id).subscribe({
      next: (response) => {
        // this.tasks = this.tasks.filter((t) => task.task_name !== task.task_name);
        this.loadTasks();
        alert('Task deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        alert('Failed to delete task.');
      },
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
