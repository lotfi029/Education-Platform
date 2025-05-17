import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout.component';
import { AuthService } from '../../../services/auth.service';
import { loginRequest } from '../../../../interfaces/auths/loginRequest';
import { TResult } from '../../../../abstractions/Result';
import { authResponse } from '../../../../interfaces/auths/authResponse';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, AuthLayoutComponent, RouterModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isSubmitted = false;
  errorMessage: string = '';
  errorType: 'error' | 'warning' | 'info' = 'error';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  private setErrorMessage(message: string, type: 'error' | 'warning' | 'info' = 'error') {
    this.errorMessage = message;
    this.errorType = type;
  }

  private clearErrorMessage() {
    this.errorMessage = '';
    this.errorType = 'error';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitted = true;
      this.clearErrorMessage();
      
      const request: loginRequest = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(request).subscribe({
        next: (result: TResult<authResponse>) => {
          if (result.isSucceed) {
            this.isSubmitted = false;
            this.router.navigate(['/profile']);
          } else {
            this.isSubmitted = false;
            // const errorMessage = result.error.descriptions?.join('. ') || 'Login failed. Please try again.';
            this.setErrorMessage('Login failed. Please try again.', 'error');
          }
        },
        error: (error) => {
          console.log('Login failed:', error);
          this.isSubmitted = false;
          const errorMessage = error.error?.message || 'An unexpected error occurred. Please try again later.';
          this.setErrorMessage(errorMessage, 'error');
        }
      });
    } else {
      this.setErrorMessage('Please fill in all required fields correctly.', 'warning');
    }
  }
} 