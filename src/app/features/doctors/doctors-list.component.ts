import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorsService, Doctor } from '../../core/services/doctors.service';
import { AddDoctorComponent } from './add-doctor.component';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AddDoctorComponent, SidebarComponent],
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.css']
})
export class DoctorsListComponent implements OnInit {
  doctors: (Doctor & { created_at?: string })[] = [];
  filteredDoctors: (Doctor & { created_at?: string })[] = [];
  search = '';
  showAddDoctor = false;

  constructor(private doctorsService: DoctorsService) {}

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorsService.getAllDoctors().subscribe(doctors => {
      this.doctors = doctors;
      this.filteredDoctors = doctors;
    });
  }

  onSearchChange() {
    const term = this.search.toLowerCase();
    this.filteredDoctors = this.doctors.filter(d =>
      d.name.toLowerCase().includes(term) ||
      d.specialization.toLowerCase().includes(term) ||
      d.license_number.toLowerCase().includes(term) ||
      d.email.toLowerCase().includes(term)
    );
  }

  openAddDoctor() {
    this.showAddDoctor = true;
  }

  closeAddDoctor(reload: boolean = false) {
    this.showAddDoctor = false;
    if (reload) this.loadDoctors();
  }
} 