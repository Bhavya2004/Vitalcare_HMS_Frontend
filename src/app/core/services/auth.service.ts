import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/auth'; // Base URL for the authentication API
  private isAuthenticated: boolean = false; // Flag to check if the user is authenticated
  private role: string = ''; 

  constructor(private http:HttpClient) { 
    // Initialize authentication state from localStorage
    this.initializeAuthState();
  }

  // Initialize authentication state from localStorage
  private initializeAuthState(): void {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');
    
    if (token && storedRole) {
      this.isAuthenticated = true;
      this.role = storedRole;
      console.log('Auth state initialized with role:', this.role);
    }
  }

  //Login Method
  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, password });
  }

  //Register Method
  register(email: string, password: string, firstName: string, lastName: string) {
    return this.http.post(`${this.baseUrl}/register`, { email, password, firstName, lastName });
  }

  // Method to check if the user is authenticated
  checkAuth(): boolean {
    return this.isAuthenticated;
  }

  // Method to set the user's role
  setRole(role: string): void {
    this.role = role;
    this.isAuthenticated = true;
    console.log('Role set to:', this.role);
  }
  
  // Method to get the user's role
  getRole(): string {
    return this.role;
  }

  // Method to logout
  logout(): void {
    this.isAuthenticated = false;
    this.role = '';
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  }
}
