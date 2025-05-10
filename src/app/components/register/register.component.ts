import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { RegisterRequest } from '../../../interfaces/auths/RegisterRequest';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerRequest!: RegisterRequest;
  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      bio: ['', Validators.required],
    });
  }
  onSubmit() {
    this.registerRequest = this.registerForm.value;
    this.authService.register(this.registerRequest).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
