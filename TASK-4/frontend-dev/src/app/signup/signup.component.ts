import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder) {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSignup(): void {
    if (this.signupForm.valid && !this.hasPasswordMismatch()) {
      const id=1;
      const { name, email, password } = this.signupForm.value;
      console.log(this.signupForm);
      console.log(id);
      console.log(name);
      console.log(email);
      console.log(password);

      this.http.post('http://localhost:4242/api/signup', { id,name, email, password }).subscribe({
        next: (response) => {
          console.log('User signed up successfully', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Signup failed', error);
        }
      });
    }
    else {
      console.error('Signup form is invalid or passwords do not match');
    }
  }

  hasPasswordMismatch(): boolean {
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;
    return password !== confirmPassword;
  }
}
