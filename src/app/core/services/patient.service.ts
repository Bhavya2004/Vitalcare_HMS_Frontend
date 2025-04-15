import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface PatientRegistrationData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  email: string;
  marital_status: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  relation: string;
  blood_group?: string;
  allergies?: string;
  medical_conditions?: string;
  medical_history?: string;
  insurance_provider?: string;
  insurance_number?: string;
  privacy_consent: boolean;
  service_consent: boolean;
  medical_consent: boolean;
  img?: string;
  colorCode?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:3000/patient';

  constructor(private http: HttpClient) {}

  // method to get headers with authorization token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  registerPatient(patientData: PatientRegistrationData, imageFile?: File): Observable<any> {
    // Create FormData object to send multipart/form-data
    const formData = new FormData();
    
    // Add all patient data fields to FormData
    Object.keys(patientData).forEach(key => {
      if (patientData[key as keyof PatientRegistrationData] !== undefined) {
        formData.append(key, patientData[key as keyof PatientRegistrationData] as string);
      }
    });
    
    // Add image file if provided
    if (imageFile) {
      formData.append('img', imageFile);
    }
    
    // Send FormData with appropriate headers
    return this.http.post(`${this.apiUrl}/register`, formData, { 
      headers: this.getAuthHeaders()
    });
  }

  checkPatientRegistration(): Observable<boolean> {
    return this.http.get<{ isRegistered: boolean }>(`${this.apiUrl}/check-registration`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      map(response => response.isRegistered) // Extract the `isRegistered` value from the response
    );
  }
}