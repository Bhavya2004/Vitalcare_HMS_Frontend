import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Appointment } from '../../../core/services/appointment.service';
import { ToastrService } from 'ngx-toastr';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { AuthService } from '../../../core/services/auth.service';
import { AppointmentDetailComponent } from "./appointment-detail/appointment-detail.component";
// import { BookAppointmentComponent } from './book-appointment/book-appointment.component';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, AppointmentFormComponent, AppointmentDetailComponent],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  searchTerm: string = '';
  isBookingModalOpen: boolean = false;
  selectedAppointment: Appointment | null = null;
  isLoading: boolean = true;
  patientFirstName: string = '';
  patientLastName: string = '';
  patientGender: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private authService : AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.authService.getPatientDetails().subscribe((details)=>{
      if(details){
        this.patientFirstName = details.firstName;
        this.patientLastName = details.lastName;
        this.patientGender= details.gender;
      }
    })
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.appointmentService.getAppointments().subscribe({
      next: (response) => {
        this.appointments = response.data;
        this.filterAppointments();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.toastr.error('Failed to load appointments');
        this.isLoading = false;
      }
    });
  }

  filterAppointments(): void {
    if (!this.searchTerm) {
      this.filteredAppointments = this.appointments;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredAppointments = this.appointments.filter(appointment => 
      appointment.doctor.name.toLowerCase().includes(searchTermLower) ||
      appointment.type.toLowerCase().includes(searchTermLower) ||
      appointment.status.toLowerCase().includes(searchTermLower)
    );
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filterAppointments();
  }

  openBookingModal(): void {
    this.isBookingModalOpen = true;
  }

  closeBookingModal(): void {
    this.isBookingModalOpen = false;
  }

  onAppointmentBooked(): void {
    this.closeBookingModal();
    this.loadAppointments(); 
    this.toastr.success('Appointment booked successfully!');
  }

  viewAppointment(appointmentId: number): void {
    this.appointmentService.getAppointmentById(appointmentId).subscribe({
      next: (response) => {
        console.log('Fetched Appointment:', response.data); // Debugging
        this.selectedAppointment = response.data; // Assign the fetched data to selectedAppointment
      },
      error: (error) => {
        console.error('Error fetching appointment:', error);
        this.toastr.error('Failed to fetch appointment details');
      }
    });
  }

  closeViewModal(): void {
    this.selectedAppointment = null;
  }

  cancelAppointment(appointment: Appointment): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.updateAppointmentStatus(appointment.id, 'CANCELLED').subscribe({
        next: () => {
          this.toastr.success('Appointment cancelled successfully');
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Error cancelling appointment:', error);
          this.toastr.error('Failed to cancel appointment');
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(time: string): string {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SCHEDULED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getInitials(patient: any): string {
    return (patient.first_name[0] + patient.last_name[0]).toUpperCase();
  }
  
}