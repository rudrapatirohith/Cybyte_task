import { Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authGuard } from './auth/auth.guard';
import { LogoutComponent } from './auth/logout/logout.component';

export const routes: Routes = [
    {
        path: '', redirectTo:'signup', pathMatch:'full'
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
    }
];
