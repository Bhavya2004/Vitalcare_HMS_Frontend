import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../core/services/appointment.service';
import { ToastrService } from 'ngx-toastr';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { Appointment } from '../../shared/models/appointment.model';
import { DoctorAppointmentDetailComponent } from './doctor-appointment-detail.component';
import { DoctorsService } from '../../core/services/doctors.service';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent,DoctorAppointmentDetailComponent],
  templateUrl: './doctor-appointments.component.html',
  styleUrls: ['./doctor-appointments.component.css']
})
export class DoctorAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  selectedAppointment: Appointment | null = null;
  isLoading: boolean = true;
  activeActionMenu: number | null = null;
  showStatusModal: boolean = false;
  statusAction: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | null = null;
  appointmentToUpdate: Appointment | null = null;
  reason: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private doctorService : DoctorsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.appointmentService.getDoctorAppointments().subscribe({
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
    let filtered = this.appointments;
    if (this.statusFilter) {
      filtered = filtered.filter(appointment => appointment.status === this.statusFilter);
    }
    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(appointment => 
        appointment.patient.first_name.toLowerCase().includes(searchTermLower) ||
        appointment.type.toLowerCase().includes(searchTermLower) ||
        appointment.status.toLowerCase().includes(searchTermLower)
      );
    }
    this.filteredAppointments = filtered;
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filterAppointments();
  }

  toggleActionMenu(appointmentId: number): void {
    this.activeActionMenu = this.activeActionMenu === appointmentId ? null : appointmentId;
  }

  closeActionMenu(): void {
    this.activeActionMenu = null;
  }

  viewAppointment(appointmentId: number): void {
    this.selectedAppointment = this.appointments.find(a => a.id === appointmentId) || null;
    this.closeActionMenu();
    document.body.style.overflow = 'hidden';
  }

  closeViewModal(): void {
    this.selectedAppointment = null;
    document.body.style.overflow = 'auto';
  }

  openStatusModal(appointment: Appointment, action: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'): void {
    this.appointmentToUpdate = appointment;
    this.statusAction = action;
    this.reason = '';
    this.showStatusModal = true;
    this.closeActionMenu();
    document.body.style.overflow = 'hidden';
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.appointmentToUpdate = null;
    this.statusAction = null;
    this.reason = '';
    document.body.style.overflow = 'auto';
  }

  confirmStatusUpdate(): void {
    if (this.appointmentToUpdate && this.statusAction) {
      this.doctorService.updateAppointmentStatus(
        this.appointmentToUpdate.id,
        this.statusAction,
        this.statusAction === 'CANCELLED' ? this.reason : undefined
      ).subscribe({
        next: () => {
          this.toastr.success('Appointment status updated');
          this.loadAppointments();
          this.closeStatusModal();
        },
        error: (error) => {
          console.error('Error updating appointment:', error);
          this.toastr.error('Failed to update appointment');
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

  getAppointmentCountByStatus(status: string): number {
    return this.filteredAppointments.filter(appointment => appointment.status === status).length;
  }
} 