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

    // Define the properties for the login form
    id: any;
    email: string = '';
    password: string = '';
    checked: boolean = false;
    emp_id: any;
    
    onLogin() {
        const loginData = {
            email: this.email,
            password: this.password,
            id: this.id,
            emp_id: this.emp_id
        };
      
        this.http.post<any>(`${HOST_URL}/api/auth-login`, loginData).subscribe(
            response => {
                // // Debugging
                console.log(response);
                if (response.passwordCheckResult && response.token) {
                    this.authService.login(response.token);
            
                    const user = this.authService.getCurrentUser();
                    const role = user?.role;
            
                    if (role === 'Employee') {
                        this.router.navigate(['/pages/tasks']);
                    } else if (role === 'Admin') {
                        this.router.navigate(['/dashboard']);
                    }
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
