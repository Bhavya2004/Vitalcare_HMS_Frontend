export interface Doctor {
    id: string;
    name: string;
    specialization: string;
    img?: string;
  }
  
  export interface Patient {
    first_name: string;
    last_name: string;
    gender: string;
    phone: string;
    address: string;
    date_of_birth: string;
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
    created_at: string;
    patient: Patient;
  }
  
  export type CreateAppointmentData = Omit<
    Appointment,
    'id' | 'status' | 'created_at' | 'patient' | 'doctor' | 'reason'
  >;
  
  export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
  }