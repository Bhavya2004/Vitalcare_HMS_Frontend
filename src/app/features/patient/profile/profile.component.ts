import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../core/services/patient.service';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, SidebarComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profile: any = {};
  medicalHistory: any[] = [];
  reviews: any[] = [];
  quickLinks: any[] = [
    { name: 'Patient\'s Appointments', link: '/appointments' },
    { name: 'Medical Records', link: '/medical-records' },
    { name: 'Medical Bills', link: '/medical-bills' },
    { name: 'Dashboard', link: '/dashboard' },
    { name: 'Lab Test & Result', link: '/lab-test' },
    { name: 'Edit Information', link: '/edit-info' }
  ];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadMedicalHistory();
    this.loadReviews();
  }

  // Fetch patient profile
  loadProfile(): void {
    this.patientService.getPatientProfile().subscribe({
      next: (response) => {
        if (response) {
          this.profile = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
  }

  // Fetch medical history
  loadMedicalHistory(): void {
    this.patientService.getMedicalHistory().subscribe({
      next: (response) => {
        this.medicalHistory = response.data;
      },
      error: (error) => {
        console.error('Error loading medical history:', error);
      }
    });
  }

  // Fetch patient reviews
  loadReviews(): void {
    this.patientService.getPatientReviews().subscribe({
      next: (response) => {
        this.reviews = response.data;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }
}
