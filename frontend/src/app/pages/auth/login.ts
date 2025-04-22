import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HOST_URL } from '../../utils/utils';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './login.html'
})

export class LoginComponent {
    constructor(private http: HttpClient, private router: Router) {}
    
    email: string = '';
    password: string = '';
    checked: boolean = false;
    
    onLogin() {
        const loginData = {
          email: this.email,
          password: this.password
        };
      
        this.http.post<any>(`${HOST_URL}/api/auth-login`, loginData).subscribe(
          response => {
              console.log(response);
              if (response.passwordCheckResult) {
                // Save token or user info if needed
                this.router.navigate(['/dashboard']); // or your target route
              } else {
                alert('Invalid credentials');
              }
          },
          error => {
            console.error('Login error:', error);
            alert('Server error or wrong credentials');
          }
        );
      }
      
}
