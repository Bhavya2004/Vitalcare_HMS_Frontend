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
  private isAuthenticated: boolean = true; // Flag to check if the user is authenticated
  private role: string = ''; 

  constructor(private http:HttpClient) { }

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

  // Method to get the user's role
  getRole(): string {
    return this.role;
  }

}
