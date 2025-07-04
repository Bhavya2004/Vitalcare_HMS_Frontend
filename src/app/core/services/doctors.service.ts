import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Appointment, Diagnosis } from '../../shared/models/appointment.model';

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
    return this.http.get<Appointment>(`${this.doctorUrl}/appointments/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  addVitalSigns(appointmentId: number, data: any): Observable<any> {
    return this.http.post<any>(
      `${this.doctorUrl}/appointments/${appointmentId}/vitals`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  getDiagnosisForAppointment(appointmentId: number): Observable<Diagnosis[]> {
    return this.http.get<Diagnosis[]>(`${this.doctorUrl}/appointments/${appointmentId}/diagnosis`, {
      headers: this.getAuthHeaders(),
    });
  }

  addDiagnosisForAppointment(appointmentId: number, data: any): Observable<Diagnosis> {
    return this.http.post<Diagnosis>(`${this.doctorUrl}/appointments/${appointmentId}/diagnosis`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // --- Billing API Methods ---
  getBillsForAppointment(appointmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.doctorUrl}/appointments/${appointmentId}/bills`, {
      headers: this.getAuthHeaders(),
    });
  }

  addBillToAppointment(appointmentId: number, billData: any): Observable<any> {
    return this.http.post<any>(`${this.doctorUrl}/appointments/${appointmentId}/bills`, billData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteBillFromAppointment(appointmentId: number, billId: number): Observable<any> {
    return this.http.delete<any>(`${this.doctorUrl}/appointments/${appointmentId}/bills/${billId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  generateFinalBillForAppointment(appointmentId: number, data: any): Observable<any> {
    return this.http.post<any>(`${this.doctorUrl}/appointments/${appointmentId}/generate-bill`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.doctorUrl}/services`, {
      headers: this.getAuthHeaders(),
    });
  }
} 