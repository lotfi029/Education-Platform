import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout.component';
import { AuthService } from '../../../services/auth.service';
import { passwordMatchValidator } from '../../../validators/password-match.validator';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthLayoutComponent],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  showPassword = false;
  isSubmitted = false;
  isSuccess = false;
  userId: string = '';
  code: string = '';
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParams['userId'];
    this.code = this.route.snapshot.queryParams['code'];
    this.email = this.route.snapshot.queryParams['email'];

    if (!this.userId || !this.code || !this.email) {
      this.router.navigate(['/login']);
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.isSubmitted = true;
      const { password } = this.resetPasswordForm.value;
      
      this.authService.resetPassword(this.userId, this.code, password).subscribe({
        next: () => {
          this.isSuccess = true;
        },
        error: (error) => {
          console.error('Password reset failed:', error);
          this.isSubmitted = false;
        }
      });
    }
  }

  get password() { return this.resetPasswordForm.get('password'); }
  get confirmPassword() { return this.resetPasswordForm.get('confirmPassword'); }
} 