import { Routes } from '@angular/router';
import { InsertDataFormComponent } from './insert-data-form/insert-data-form.component';

export const routes: Routes = [
    {path: '', redirectTo:'/insert-data.',pathMatch:'full'},
    {path:'insert-data',component:InsertDataFormComponent},
    {path: '**', redirectTo: ''}
];
