import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { isValidEmail } from '../../../shared/utils/form-validation';

interface ValidationError {
  path: string[];
  message: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  fieldErrors: { [key: string]: string } = {};
  isSubmitting: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // Frontend validation
  validateForm(): boolean {
    // Clear previous errors
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
  
  
  onSubmit(): void {
    // Validate form before submission
    if (!this.validateForm()) {
      return;
    }
    
    this.isSubmitting = true;
    
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        // Save the token in localStorage
        localStorage.setItem('token', response.token);
        
        // Extract role from JWT token
        try {
          const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
          const userRole = tokenPayload.role;
          
          // Store role in localStorage
          localStorage.setItem('userRole', userRole);
          
          // Update the auth service
          this.authService.setRole(userRole);
          
          // Redirect to the dashboard
          this.router.navigate(['/dashboard']);
        } catch (error) {
          this.errorMessage = 'Error processing login response';
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        
        // Handle validation errors from Zod
        if (error.error && error.error.errors) {
          // Map validation errors to fields
          error.error.errors.forEach((err: ValidationError) => {
            const field = err.path[0];
            this.fieldErrors[field] = err.message;
          });
        } else {
          // Handle other types of errors
          this.errorMessage = error.error?.message || 'An error occurred during login';
        }
      },
    });
  }
}
