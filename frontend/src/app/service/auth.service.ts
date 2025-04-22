// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInStatus = false;

  login(userData: any) {
    // Store user data in localStorage or sessionStorage
    localStorage.setItem('user', JSON.stringify(userData)); // or sessionStorage
    // Set the logged-in status to true
    this.isLoggedInStatus = true;
  }

  logout() {
    this.isLoggedInStatus = false;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInStatus;
  }

  getCurrentUser() {
    const userData = localStorage.getItem('user'); // or sessionStorage
    return userData ? JSON.parse(userData) : null;
  }
  
}
