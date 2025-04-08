import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated: boolean = true; // Flag to check if the user is authenticated
  private role: string = ''; 

  // Method to check if the user is authenticated
  checkAuth(): boolean {
    return this.isAuthenticated;
  }

  // Method to get the user's role
  getRole(): string {
    return this.role;
  }

   // Method to set the user's role (useful for testing or dynamic role assignment)
   setRole(role: string): void {
    this.role = role;
  }

  // Mock methods to set authentication and role (for testing)
  login(role: string): void {
    this.isAuthenticated = true;
    this.role = role;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.role = '';
  }

  constructor() { }
}
