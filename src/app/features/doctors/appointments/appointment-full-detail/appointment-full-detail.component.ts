import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../../layout/sidebar/sidebar.component';
import { Appointment } from '../../../../shared/models/appointment.model';
import { DoctorsService } from '../../../../core/services/doctors.service';
import { ToastrService } from 'ngx-toastr';
import { AddVitalsModalComponent } from '../add-vitals-modal/add-vitals-modal.component';
import { AddDiagnosisModalComponent } from '../add-diagnosis-modal/add-diagnosis-modal.component';
import { Diagnosis } from '../../../../shared/models/appointment.model';

@Component({
  selector: 'app-appointment-full-detail',
  standalone: true,
  imports: [CommonModule, SidebarComponent, AddVitalsModalComponent, AddDiagnosisModalComponent, RouterModule],
  templateUrl: './appointment-full-detail.component.html',
  styleUrls: ['./appointment-full-detail.component.css'],
})
export class AppointmentFullDetailComponent implements OnInit {
  appointment: Appointment | null = null;
  isLoading = true;
  showAddVitalsModal = false;
  showAddDiagnosisModal = false;
  activeTab: 'vitals' | 'diagnosis' = 'vitals';
  diagnosisList: Diagnosis[] = [];
  isDiagnosisLoading = false;

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const appointmentId = this.route.snapshot.paramMap.get('id');
    if (appointmentId) {
      this.loadAppointmentDetails(+appointmentId);
      this.loadDiagnosis(+appointmentId);
    }
  }

  loadAppointmentDetails(id: number): void {
    this.isLoading = true;
    this.doctorService.getAppointmentById(id).subscribe({
      next: (response: Appointment) => {
        this.appointment = response;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.toastr.error('Failed to load appointment details.');
        console.error(err);
      },
    });
  }

  loadDiagnosis(id: number): void {
    this.isDiagnosisLoading = true;
    this.doctorService.getDiagnosisForAppointment(id).subscribe({
      next: (diagnosis: Diagnosis[]) => {
        this.diagnosisList = diagnosis;
        this.isDiagnosisLoading = false;
      },
      error: (err: any) => {
        this.isDiagnosisLoading = false;
        this.toastr.error('Failed to load diagnosis.');
        console.error(err);
      },
    });
  }

  onVitalsAdded(newVitals: any) {
    if (this.appointment) {
      this.loadAppointmentDetails(this.appointment.id);
    }
  }

  onDiagnosisAdded(newDiagnosis: Diagnosis) {
    if (this.appointment) {
      this.loadDiagnosis(this.appointment.id);
    }
  }

  openAddDiagnosisModal() {
    this.showAddDiagnosisModal = true;
  }

  closeAddDiagnosisModal() {
    this.showAddDiagnosisModal = false;
  }

  setActiveTab(tab: 'vitals' | 'diagnosis') {
    this.activeTab = tab;
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [hour, minute] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
}
