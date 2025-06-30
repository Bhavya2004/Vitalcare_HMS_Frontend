import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Appointment } from '../../shared/models/appointment.model';

export interface WorkingDay {
  day: string;
  start_time: string;
  close_time: string;
}

export interface Doctor {
  id?: string;
  name: string;
  specialization: string;
  department: string;
  license_number: string;
  phone: string;
  email: string;
  address: string;
  type: 'FULL' | 'PART';
  working_days: WorkingDay[];
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class DoctorsService {
  private adminUrl = `${environment.apiUrl}/admin/doctors`;
  private patientUrl = `${environment.apiUrl}/patient/doctors`;
  private doctorUrl = `${environment.apiUrl}/doctor`;
  private doctorDashboardUrl = `${environment.apiUrl}/doctor/dashboard`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  updateAppointmentStatus(
    id: number,
    status: 'PENDING' | 'SCHEDULED' | 'CANCELLED' | 'COMPLETED',
    reason?: string
  ): Observable<ApiResponse<Appointment>> {
    return this.http.put<ApiResponse<Appointment>>(
      `${this.doctorUrl}/appointments/${id}/status`,
      { status, reason },
      { headers: this.getAuthHeaders() }
    );
  }

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.adminUrl, {
      headers: this.getAuthHeaders()
    });
  }

  addDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.adminUrl, doctor, {
      headers: this.getAuthHeaders()
    });
  }

  getDoctorsForPatient(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.patientUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.doctorDashboardUrl}/appointments/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  addVitalSigns(appointmentId: number, data: any): Observable<any> {
    return this.http.post<any>(
      `${this.doctorDashboardUrl}/appointments/${appointmentId}/vitals`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }
} 