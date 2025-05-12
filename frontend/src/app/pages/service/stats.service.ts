// stats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HOST_URL } from '../../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  constructor(private http: HttpClient) {}

  baseurl = `${HOST_URL}/api/employees`

  getEmployeeCount(): Observable<any> {
    // Replace with your actual API endpoint
    return this.http.get<number>(`${this.baseurl}/total-employees`);
  }
  getTaskCount(): Observable<any> {
    // Replace with your actual API endpoint
    return this.http.get<number>(`${HOST_URL}/api/tasks/total-tasks`);
  }
  getDepartmentsCount(): Observable<any> {
    // Replace with your actual API endpoint
    return this.http.get<number>(`${HOST_URL}/api/departments/total-departments`);
  }
}