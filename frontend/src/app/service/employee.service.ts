import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { HOST_URL } from '../utils/utils';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
   
    private apiUrl = `${HOST_URL}/api/employees`;

    constructor(private http: HttpClient) { }

    getAllEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.apiUrl);
    }

    getEmployeeById(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}/${id}`);
    }

    addEmployee(employee: Employee): Observable<any> {
        return this.http.post(`${this.apiUrl}/addEmployee`, employee);
      }
      
    
    updateEmployee(id: number, employee: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
    }
    

    deleteEmployee(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
