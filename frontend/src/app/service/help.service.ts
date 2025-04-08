import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HelpRequest } from '../models/help.model';
import { HOST_URL } from '../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class HelpService {
  private baseUrl = `${HOST_URL}/api/help`;

  constructor(private http: HttpClient) {}

  submitHelpRequest(helpData: HelpRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}`, helpData);
  }

  getAllHelpRequests(): Observable<HelpRequest[]> {
    return this.http.get<HelpRequest[]>(this.baseUrl);
  }

  deleteHelpRequest(email: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${email}`);
  }
}
export type { HelpRequest };

