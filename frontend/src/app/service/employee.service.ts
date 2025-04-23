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

   // employee.service.ts
    getAllEmployees(): Observable<any> {
        return this.http.get(`${HOST_URL}/api/employees`);
    }
  
    getEmployeeById(user_id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}/${user_id}`);
    }

    getEmployeesByDeptId(dept_id: number): Observable<Employee[]> {
        // // Debugging
        // console.log("dept id from service", dept_id);
        return this.http.get<Employee[]>(`${this.apiUrl}/department/${dept_id}`);    
    }
    
    addEmployee(employee: Employee): Observable<any> {
        return this.http.post<{ message: string }>(`${this.apiUrl}`, employee);
      }
      
    
    updateEmployee(id: number, employee: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
    }
    

    deleteEmployee(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
