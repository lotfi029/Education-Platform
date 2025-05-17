import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout.component';
import { passwordMatchValidator } from '../../../validators/password-match.validator';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../../interfaces/auths/RegisterRequest';
import { catchError, finalize } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Result } from '../../../../abstractions/Result';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthLayoutComponent],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  errorMessage: string = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('first', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('last', [Validators.required, Validators.minLength(2)]),
      userName: new FormControl('username', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('email@email.com', [Validators.required, Validators.email]),
      password: new FormControl('String!23', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
      confirmPassword: new FormControl('String!23', [Validators.required]),
      acceptTerms: new FormControl(true, [Validators.requiredTrue])
    }, {
      validators: passwordMatchValidator
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    
    this.errorMessage = ''; // Clear any previous errors
    this.isSubmitting = true;

    var registerRequest: RegisterRequest = {
      userName: this.registerForm.get('userName')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value
    }

    if (this.registerForm.valid) {
      this.authService.register(registerRequest).pipe(
        tap({
          next: (result: Result) => {
            if (result.isSucceed) {
              this.router.navigate(['/login']);
            } else if (result.error) {
              if (result.error.status === 409) {
                this.errorMessage = 'This email or username is already registered. Please use different credentials.';
              } else {
                this.errorMessage = result.error.descriptions?.join(', ') || 'Registration failed. Please try again.';
              }
            }
          }
        }),
        catchError(() => {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
          return of(null);
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      ).subscribe();
    } else {
      this.isSubmitting = false;
    }
  }

  // Form getters
  get userName() { return this.registerForm.get('userName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get acceptTerms() { return this.registerForm.get('acceptTerms'); }
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
} 