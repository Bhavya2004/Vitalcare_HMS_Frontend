import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private adminUrl = `${environment.apiUrl}/admin/services`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getServices(): Observable<any> {
    return this.http.get<any>(this.adminUrl, {
      headers: this.getAuthHeaders()
    });
  }

  addService(data: { service_name: string; price: number; description: string }): Observable<any> {
    return this.http.post<any>(this.adminUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  getAdminDashboardStats(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/admin/dashboard/stats', {
      headers: this.getAuthHeaders(),
    });
  }
} 