import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        // Save the token in localStorage
        localStorage.setItem('token', response.token);
        
        // Extract role from JWT token
        try {
          const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
          const userRole = tokenPayload.role;
          console.log('User role:', userRole);
          
          // Store role in localStorage
          localStorage.setItem('userRole', userRole);
          
          // Update the auth service
          this.authService.setRole(userRole);
          
          // Redirect to the dashboard
          this.router.navigate(['/dashboard']);
        } catch (error) {
          console.error('Error parsing token:', error);
          this.errorMessage = 'Error processing login response';
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = error.error?.message;
      },
    });
  }
}
