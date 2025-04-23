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
  
    const user = this.authService.getCurrentUser();
    const userRole = user?.role;
    const currentUrl = state.url;
  
    if (userRole === 'Employee') {
      const allowedRoutes = ['/pages/tasks', '/pages/help', '/pages/profile'];
      if (!allowedRoutes.includes(currentUrl)) {
        this.router.navigate(['/auth/access-denied']);
        return false;
      }
    }
  
    return true;
  }
  
}
