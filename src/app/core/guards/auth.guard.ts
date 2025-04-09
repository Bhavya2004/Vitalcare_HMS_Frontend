import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.checkAuth()) {
      return true;
    }
    
    // Redirect to login page if not authenticated
    this.router.navigate(['/sign-in']);
    return false;
  }
} 