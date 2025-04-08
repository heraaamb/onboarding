import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { TaskComponent } from './tasks/tasks.component'; // Correct import
import { ProfileComponent } from './profile/profile.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';

export default [
    { path: 'employee-list', component: EmployeeListComponent },
    { path: 'empty', component: Empty },
    // { path : 'help',component:HelpComponent}
    { path: 'tasks', component: TaskComponent },
    { path: 'profile', component: ProfileComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
