import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [RouterLink,FormsModule],
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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    console.log('form submitted')
    this.authService.register(this.email, this.password, this.firstName, this.lastName).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        // Redirect to the login page or another page
        this.router.navigate(['/sign-in']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.errorMessage = error.error.message ;
      },
    });
  }
}
