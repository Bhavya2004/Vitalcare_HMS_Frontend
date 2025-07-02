import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-service-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-service-modal.component.html',
  styleUrls: ['./add-service-modal.component.css']
})
export class AddServiceModalComponent {
  @Output() close = new EventEmitter<boolean>();

  service_name = '';
  price: number | null = null;
  description = '';
  isSubmitting = false;
  errorMessage = '';

  constructor(private adminService: AdminService,private toastr: ToastrService) {}

  submit() {
    if (!this.service_name || !this.price || !this.description) {
      return;
    }
    this.isSubmitting = true;
    this.adminService.addService({
      service_name: this.service_name,
      price: this.price,
      description: this.description
    }).subscribe({
      next: () => {
        this.toastr.success('Service added successfully!');
        this.isSubmitting = false;
        this.close.emit(true);
      },
      error: (err) => {
        this.toastr.error('Failed to add service.');
        this.isSubmitting = false;
      }
    });
  }

  onClose() {
    this.close.emit(false);
  }
} 