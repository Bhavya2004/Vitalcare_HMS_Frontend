import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DoctorsService } from '../../../../core/services/doctors.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-bill-modal',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './add-bill-modal.component.html',
  styleUrls: ['./add-bill-modal.component.css']
})
export class AddBillModalComponent implements OnInit {
  @Input() appointmentId!: number;
  @Output() close = new EventEmitter<boolean>();
  @Output() billAdded = new EventEmitter<void>();

  services: any[] = [];
  selectedService: any = null;
  quantity: number = 1;
  serviceDate: string = '';
  isSubmitting = false;
  errorMessage = '';

  constructor(private doctorsService: DoctorsService, private toastr: ToastrService) {}

  ngOnInit() {
    this.doctorsService.getAllServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: () => {
        this.errorMessage = 'Failed to load services.';
      }
    });
  }

  get unitCost() {
    return this.selectedService ? this.selectedService.price : 0;
  }

  get totalCost() {
    return this.unitCost * this.quantity;
  }

  submit() {
    if (!this.selectedService || !this.quantity || !this.serviceDate) {
      this.errorMessage = 'All fields are required.';
      return;
    }
    this.isSubmitting = true;
    this.doctorsService.addBillToAppointment(this.appointmentId, {
      service_id: this.selectedService.id,
      quantity: this.quantity,
      service_date: this.serviceDate
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastr.success('Bill added successfully!');
        this.billAdded.emit();
        this.close.emit(true);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to add bill.';
        this.toastr.error(this.errorMessage);
      }
    });
  }

  onClose() {
    this.close.emit(false);
  }
} 