import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const user = this.authService.getCurrentUser(); // Make sure this method returns role info
    // // Debugging line to check user data
    // console.log('User data from AuthGuard:', user); // Check if user data is retrieved correctly
    const userRole = user?.role;
    const currentUrl = state.url;

    // Restrict employee access to only specific pages
    if (userRole === 'Employee') {
      // Define the allowed routes for employees
      // You can add more routes to this array as needed
      const allowedEmployeeRoutes = [
        '/pages/tasks',
        '/pages/help',
        '/pages/profile',
      ];

      // Check if the current URL is in the allowed routes for employees
      if (!allowedEmployeeRoutes.includes(currentUrl)) {
        this.router.navigate(['/auth/access-denied']);
        return false;
      };
    }

    // Allow all routes for other roles
    return true;
  }
}
