import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  img?: string;
}

export interface Appointment {
  id: number;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  time: string;
  status: 'PENDING' | 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';
  type: string;
  note?: string;
  reason?: string;
  doctor: Doctor;
}

export interface CreateAppointmentData {
  doctor_id: string;
  appointment_date: string;
  time: string;
  type: string;
  note?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/patient/appointments`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all appointments for the logged-in patient
  getAppointments(): Observable<ApiResponse<Appointment[]>> {
    return this.http.get<ApiResponse<Appointment[]>>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // Get a specific appointment by ID
  getAppointmentById(id: number): Observable<ApiResponse<Appointment>> {
    return this.http.get<ApiResponse<Appointment>>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Create a new appointment
  createAppointment(data: CreateAppointmentData): Observable<ApiResponse<Appointment>> {
    return this.http.post<ApiResponse<Appointment>>(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  // Update appointment status
  updateAppointmentStatus(
    id: number,
    status: 'PENDING' | 'SCHEDULED' | 'CANCELLED' | 'COMPLETED',
    reason?: string
  ): Observable<ApiResponse<Appointment>> {
    return this.http.patch<ApiResponse<Appointment>>(
      `${this.apiUrl}/${id}/status`,
      { status, reason },
      { headers: this.getAuthHeaders() }
    );
  }

  getDoctors(): Observable<ApiResponse<Doctor[]>> {
    return this.http.get<ApiResponse<Doctor[]>>(`${this.apiUrl}/doctors`, {
      headers: this.getAuthHeaders()
    });
  }
} 