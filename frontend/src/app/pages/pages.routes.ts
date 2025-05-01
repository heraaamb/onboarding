import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { TaskComponent } from './tasks/tasks.component'; // Correct import
import { ProfileComponent } from './profile/profile.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { HelpComponent } from './help/help.component';
import { AuthGuard } from './auth/auth.guard'; // Import the AuthGuard
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { AuthService } from '../service/auth.service'; // Import the AuthService

export default [
    { path: 'employee-list', component: EmployeeListComponent, canActivate: [AuthGuard] },
    { path: 'empty', component: Empty },
    { path: 'tasks', component: TaskComponent , canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'help', component: HelpComponent, canActivate: [AuthGuard] },
    { path: 'document-upload', component: DocumentUploadComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
