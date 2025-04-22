import { Routes } from '@angular/router';
import { Access } from './access_denied';
import { LoginComponent } from './login';
import { Error } from './error';

export default [
    { path: 'access-denied', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: LoginComponent }
] as Routes;
