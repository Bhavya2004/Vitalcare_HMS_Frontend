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
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  errorMessage: string = '';
  fieldErrors: { [key: string]: string } = {};
  isSubmitting: boolean = false;

  private readonly loginRoute = '/sign-in';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  /**
   * Validates the registration form.
   * 
   * @returns `true` if the form is valid, `false` otherwise.
   */
  validateForm(): boolean {
    // Clear previous error messages.
    this.fieldErrors = {};
    this.errorMessage = '';

    let isValid = true;

    // First name and last name validation
    if (this.firstName && this.firstName.length < 2) {
      this.fieldErrors['firstName'] = 'First name must be at least 2 characters long';
      isValid = false;
    }

    if (this.lastName && this.lastName.length < 2) {
      this.fieldErrors['lastName'] = 'Last name must be at least 2 characters long';
      isValid = false;
    }

    // Email validation
    if (!this.email) {
      this.fieldErrors['email'] = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(this.email)) {
      this.fieldErrors['email'] = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!this.password) {
      this.fieldErrors['password'] = 'Password is required';
      isValid = false;
    } else if (this.password.length < 8) {
      this.fieldErrors['password'] = 'Password must be at least 8 characters long';
      isValid = false;
    }

    return isValid;
  }

  /**
   * Handles the registration form submission.
   */
  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    this.authService
      .register({
        email: this.email,
        password: this.password,
        firstName: this.firstName || undefined,
        lastName: this.lastName || undefined,
      })
      .subscribe({
        next: () => this.handleRegistrationSuccess(),
        error: (error) => this.handleRegistrationError(error),
      });
  }

  /**
   * Handles successful registration.
   */
  private handleRegistrationSuccess(): void {
    this.isSubmitting = false;
    this.toastr.success('Registration successful!', 'Welcome to VitalCare HMS');
    this.router.navigate([this.loginRoute]);
  }

  /**
   * Handles registration errors.
   * 
   * @param error - The error object.
   */
  private handleRegistrationError(error: any): void {
    this.isSubmitting = false;

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
      this.errorMessage = error.error?.message || 'An error occurred during registration';
    }
  }
}