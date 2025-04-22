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
import { AuthService } from '../../service/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './login.html'
})

export class LoginComponent {
    constructor(private http: HttpClient, private router: Router , private authService: AuthService) {}
    
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
                console.log("response: ",response);
                if (response.passwordCheckResult) {
                    this.authService.login(); // mark user as logged in
                    this.router.navigate(['/dashboard']);
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
