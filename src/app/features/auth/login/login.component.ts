import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { isValidEmail } from '../../../shared/utils/form-validation';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from '../../../core/services/patient.service';

interface ValidationError {
  path: string[];
  message: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  fieldErrors: { [key: string]: string } = {};
  isSubmitting: boolean = false;

  private readonly dashboardRoute = '/dashboard';
  private readonly registrationRoute = '/patient/register';

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  /**
   * Validates the login form.
   * 
   * @returns `true` if the form is valid, `false` otherwise.
   */
  validateForm(): boolean {
    // Clears previous error messages.
    this.fieldErrors = {};
    this.errorMessage = '';

    let isValid = true;

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
   * Handles the login form submission.
   */
  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => this.handleLoginSuccess(response),
      error: (error) => this.handleLoginError(error),
    });
  }

  /**
   * Handles successful login.
   * 
   * @param response - The login response.
   */
  private handleLoginSuccess(response: any): void {
    this.isSubmitting = false;

    try {
      // Save the token and role in localStorage
      localStorage.setItem('token', response.token);
      const userRole = this.extractUserRoleFromToken(response.token);
      localStorage.setItem('userRole', userRole);

      // Update the auth service
      this.authService.setRole(userRole);

      this.toastr.success('Login successful!', 'Welcome Back');

      // Redirect based on role
      this.redirectUserBasedOnRole(userRole);
    } catch (error) {
      this.errorMessage = 'Error processing login response';
    }
  }

  /**
   * Handles login errors.
   * 
   * @param error - The error object.
   */
  private handleLoginError(error: any): void {
    this.isSubmitting = false;

    if (error.error && error.error.errors) {
      // Map validation errors to fields
      error.error.errors.forEach((err: ValidationError) => {
        const field = err.path[0];
        this.fieldErrors[field] = err.message;
      });
    } else {
      this.errorMessage = error.error?.message || 'An error occurred during login';
    }
  }

  /**
   * Extracts the user's role from the JWT token.
   * 
   * @param token - The JWT token.
   * @returns The user's role.
   */
  private extractUserRoleFromToken(token: string): string {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    return tokenPayload.role;
  }

  /**
   * Redirects the user based on their role.
   * 
   * @param userRole - The user's role.
   */
  private redirectUserBasedOnRole(userRole: string): void {
    if (userRole === 'PATIENT') {
      this.patientService.checkPatientRegistration().subscribe({
        next: (isRegistered) => {
          const route = isRegistered ? this.dashboardRoute : this.registrationRoute;
          this.router.navigate([route]);
        },
        error: () => {
          this.router.navigate([this.registrationRoute]);
        },
      });
    } else {
      this.router.navigate([this.dashboardRoute]);
    }
  }
}