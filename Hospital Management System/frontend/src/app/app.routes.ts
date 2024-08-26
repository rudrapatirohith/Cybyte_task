import { Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authGuard } from './auth/auth.guard';
import { LogoutComponent } from './auth/logout/logout.component';
import { RecordsComponent } from './records/records.component';

export const routes: Routes = [
    {
        path: '', redirectTo:'login', pathMatch:'full'
    },
    {
        path: 'form', component: FormComponent,canActivate:[authGuard]
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'signup', component: SignupComponent
    },
    {
        path: 'logout', component: LogoutComponent,canActivate:[authGuard]
    },
    {
        path: 'records', component: RecordsComponent,canActivate:[authGuard]
    },
    {
        path: 'form/:id', component: FormComponent, canActivate: [authGuard]  // Route for viewing/editing a specific record

    }
];
