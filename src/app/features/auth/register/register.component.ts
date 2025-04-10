import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { isValidEmail } from '../../../shared/utils/form-validation';
import { ToastrService } from 'ngx-toastr';

interface ValidationError {
  message: string;
  field?: string;
}

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  errorMessage: string = '';
  fieldErrors: { [key: string]: string } = {};
  isSubmitting: boolean = false;

  constructor(private authService: AuthService, private router: Router,private toastr:ToastrService) {}

  // Frontend validation
  validateForm(): boolean {
    this.fieldErrors = {};
    let isValid = true;

    // First name and last name are optional, but if provided, validate them
    if (this.firstName && this.firstName.length < 2) {
      this.fieldErrors['firstName'] = 'First name must be at least 2 characters long';
      isValid = false;
    }

    if (this.lastName && this.lastName.length < 2) {
      this.fieldErrors['lastName'] = 'Last name must be at least 2 characters long';
      isValid = false;
    }

    // Email is required
    if (!this.email) {
      this.fieldErrors['email'] = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(this.email)) {
      this.fieldErrors['email'] = 'Please enter a valid email address';
      isValid = false;
    }

    // Password is required
    if (!this.password) {
      this.fieldErrors['password'] = 'Password is required';
      isValid = false;
    } else if (this.password.length < 8) {
      this.fieldErrors['password'] = 'Password must be at least 8 characters long';
      isValid = false;
    }

    return isValid;
  }

  onSubmit(): void {
    // Clear previous errors
    this.errorMessage = '';
    this.fieldErrors = {};

    if (!this.validateForm()) {
      return;
    }
    
    this.isSubmitting = true;
    
    this.authService.register({
      email: this.email,
      password: this.password,
      firstName: this.firstName || undefined,
      lastName: this.lastName || undefined
    }).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        this.toastr.success('Registration successful!', 'Welcome to VitalCare HMS');

        // Redirect to the login page
        this.router.navigate(['/sign-in']);
      },
      error: (error) => {
        this.isSubmitting = false;
        // Handle validation errors from Zod
        if (error.error && error.error.errors) {
          // Map validation errors to fields
          error.error.errors.forEach((err: ValidationError) => {
            if (err.field) {
              this.fieldErrors[err.field] = err.message;
            } else {
              this.errorMessage = err.message;
            }
          });
        } else {
          // Handle other types of errors
          this.errorMessage = error.error?.message || 'An error occurred during registration';
        }
      },
    });
  }
}
