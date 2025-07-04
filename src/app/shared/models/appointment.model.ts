export interface VitalSigns {
  id: number;
  created_at: string;
  body_temperature: number;
  systolic: number;
  diastolic: number;
  heartRate: string;
  heart_rate?: string;
  weight: number;
  height: number;
}

export interface MedicalRecord {
  id: number;
  vital_signs: VitalSigns[];
}

export interface Patient {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone: string;
  address: string;
  date_of_birth: string;
  img?: string;
  email: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  img?: string;
}

export interface Appointment {
  id: number;
  appointment_date: string;
  time: string;
  status: 'PENDING' | 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';
  type: string;
  note: string;
  reason?: string;
  patient: Patient;
  doctor: Doctor;
  medical?: MedicalRecord;
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
  errors?: any;
}

export interface Diagnosis {
  id: number;
  patient_id: string;
  medical_id: number;
  doctor_id: string;
  symptoms: string;
  diagnosis: string;
  notes?: string;
  prescribed_medications?: string;
  follow_up_plan?: string;
  created_at: string;
  updated_at: string;
  doctor?: Doctor;
}