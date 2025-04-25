import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppointmentService, Doctor } from '../../../../core/services/appointment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  imports: [CommonModule,FormsModule],
})
export class AppointmentFormComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() appointmentBooked = new EventEmitter<void>();

  doctors: Doctor[] = [];
  isLoading = false;
  error: string | null = null;

  appointmentData = {
    type: '',
    doctor_id: '',
    appointment_date: '',
    time: '',
    note: ''
  };

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.loadDoctors();
  }

  private loadDoctors() {
    this.isLoading = true;
    this.error = null;
    
    this.appointmentService.getDoctors().subscribe({
      next: (response) => {
        this.doctors = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error?.error?.message || 'Failed to load doctors';
        this.isLoading = false;
      }
    });
  }

  submitAppointment() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.appointmentService.createAppointment(this.appointmentData).subscribe({
      next: () => {
        this.appointmentBooked.emit();
        this.close.emit();
      },
      error: (error) => {
        this.error = error?.error?.message || 'Failed to book appointment';
        this.isLoading = false;
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  }
  
}