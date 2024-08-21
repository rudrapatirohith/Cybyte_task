import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
loginForm: FormGroup;
loading= false;
errorMessage: string | null=null;


constructor(private http:HttpClient, private formBuilder:FormBuilder, private router:Router, private authService: AuthService){
  this.loginForm= this.formBuilder.group({
    email: ['',[Validators.required,Validators.email]],
    password: ['',[Validators.required,Validators.minLength(6)]],
  })
}


onLogin(): void{
  if(this.loginForm.valid){
    this.loading=true;
    const {email,password} = this.loginForm.value;
    this.http.post<{message:string; userId:string; token:string}>('http://localhost:4242/api/login',{email,password}).subscribe({
      next:(response)=>{
        console.log('Login Successful',response);
        this.authService.saveToken(response.token);  // Save the token
        this.router.navigate(['/form']);        
      },
      error:(error)=>{
        console.error('Login error:',error);
        this.errorMessage=error.error.message || 'An error occurred during login.';
      }
    });
  }
 
}
}
