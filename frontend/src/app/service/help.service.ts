import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HOST_URL } from '../utils/utils';

export interface HelpRequest {
  emp_id: any;
  query_text: string;
}

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  private apiUrl = `${HOST_URL}/api/employee-queries`;

  constructor(private http: HttpClient) {}

  submitHelpRequest(request: HelpRequest): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }

  getAllEmployeeQueries(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getEmployeeQueriesByEmpID(empId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${empId}`);
  }

  getAllOpenEmployeeQueries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/open`);
  }

  replyToHelpRequest(queryId: number, response: string) {
    return this.http.post(`${this.apiUrl}/reply`, {
      query_id: queryId,
      response: response
    });
  }
}
