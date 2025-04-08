import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { HOST_URL } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  
  private apiUrl = `${HOST_URL}/api/profile`;

  constructor(private http: HttpClient) {}

  // Fetch profile data by employee ID
  getProfileById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  // Update profile data for a given employee ID
  updateProfile(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }
}
