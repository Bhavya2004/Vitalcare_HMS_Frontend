import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AddServiceModalComponent } from './add-service-modal.component';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';

interface Service {
  id: number;
  service_name: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, AddServiceModalComponent,SidebarComponent],
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css']
})
export class ServicesListComponent {
  services: Service[] = [];
  isLoading = true;
  showAddModal = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.fetchServices();
  }

  fetchServices() {
    this.isLoading = true;
    this.adminService.getServices().subscribe({
      next: (res: { data: Service[] }) => {
        this.services = res.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal(refresh = false) {
    this.showAddModal = false;
    if (refresh) this.fetchServices();
  }
} 