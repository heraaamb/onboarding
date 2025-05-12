import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';  // Adjust this to match your backend route

  constructor(private http: HttpClient) {}

  login(token: string) {
    localStorage.setItem('authToken', token);
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;  // includes id, email, role, emp_id
    } catch {
      return null;
    }
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(
      `${this.apiUrl}/auth-change-password`,
      { currentPassword, newPassword },
      { headers }
    );
  }
}
