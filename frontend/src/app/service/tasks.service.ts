import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { HOST_URL } from '../utils/utils';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  
  private baseUrl = `${HOST_URL}/api/tasks`;

  constructor(private http: HttpClient) {}
  getAllTasks(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getTasksById(emp_id:any): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/${emp_id}`);
  }

  addTask(task: Task): Observable<any> {
    return this.http.post(`${this.baseUrl}`, task);
  }

  editTask(task_id: number, task: Task): Observable<any> {
    return this.http.put(`${this.baseUrl}/${task_id}`, task);
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${taskId}`);
  }
}
