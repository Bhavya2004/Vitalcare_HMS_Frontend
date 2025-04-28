import { Component, OnInit, Output, EventEmitter, Input, signal, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService, Doctor } from '../../../../core/services/appointment.service';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) patientName = '';
  @Input({ required: true }) patientGender = '';

  @Output() close = new EventEmitter<void>();
  @Output() appointmentBooked = new EventEmitter<void>();

  doctors: Doctor[] = [];
  isLoading = false;
  error: string | null = null;

  appointmentForm!: FormGroup;
  initials: string = '';

  constructor(private fb: FormBuilder, private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.loadDoctors();
    this.initForm();
    this.setInitials();  
  }

  ngOnChanges() {
    this.setInitials(); 
  }

  private initForm() {
    this.appointmentForm = this.fb.group({
      type: ['', [Validators.required]],
      doctor_id: ['', [Validators.required]],
      appointment_date: ['', [Validators.required, this.appointmentDateValidator]],
      time: ['', [Validators.required, this.timeFormatValidator]],
      note: ['']
    });
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
    if (this.isLoading || this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched(); // Highlight empty fields
      return;
    }
  
    this.isLoading = true;
    this.appointmentService.createAppointment(this.appointmentForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.appointmentBooked.emit();
        this.close.emit();
      },
      error: (error) => {
        this.isLoading = false;
  
        if (error?.status === 409) {
          this.error=error?.error?.message || 'This time slot is already booked for the selected doctor';
        }
        // Handle Zod validation errors
        else if (error?.error?.errors) {
          const zodErrors = error.error.errors;
          zodErrors.forEach((zodError: any) => {
            const field = zodError.path[0]; // Get the field name
            const message = zodError.message; // Get the error message
            const control = this.appointmentForm.get(field);
            if (control) {
              control.setErrors({ zodError: message }); // Set Zod error on the control
            }
          });
        } else {
          this.error = error?.error?.message || 'Failed to book appointment';
        }
      }
    });
  }

  private setInitials() {
    if (!this.patientName) {
      this.initials = '';
      return;
    }
    const names = this.patientName.split(' ');
    this.initials = names.map(n => n[0]).join('').toUpperCase();
  }

  private appointmentDateValidator(control: any) {
    if (!control.value) {
      return {required: 'Appointment date is required'}; 
    }
  
    return null;
  }

  private timeFormatValidator(control: any) {
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (control.value && !timePattern.test(control.value)) {
      return { invalidTime: 'Time must be in HH:MM format' };
    }
    return null;
  }
}

