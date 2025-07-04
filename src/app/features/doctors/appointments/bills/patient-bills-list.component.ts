import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DoctorsService } from '../../../../core/services/doctors.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-bills-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-bills-list.component.html',
  styleUrls: ['./patient-bills-list.component.css']
})
export class PatientBillsListComponent implements OnInit {
  @Input() appointmentId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() addBill = new EventEmitter<void>();
  @Output() generateFinalBill = new EventEmitter<void>();
  @Output() billsChanged = new EventEmitter<void>();
  @Output() totalBillChange = new EventEmitter<number>();

  bills: any[] = [];
  isLoading = false;
  error: string = '';
  paymentStatus: string = 'UNPAID';

  // Summary fields
  totalBill = 0;
  discount = 0;
  payable = 0;
  amountPaid = 0;
  unpaidAmount = 0;

  constructor(private doctorsService: DoctorsService, private toastr: ToastrService) {}

  ngOnInit() {
    this.fetchBills();
  }

  fetchBills() {
    this.isLoading = true;
    this.doctorsService.getBillsForAppointment(this.appointmentId).subscribe({
      next: (bills: any[]) => {
        this.bills = bills;
        this.calculateSummary();
        this.isLoading = false;
        // Fetch payment status (assume all bills have same payment if present)
        if (bills.length && bills[0].payment && bills[0].payment.status) {
          this.paymentStatus = bills[0].payment.status;
        } else {
          this.paymentStatus = 'UNPAID';
        }
      },
      error: (err: any) => {
        this.error = 'Failed to load bills.';
        this.isLoading = false;
      }
    });
  }

  calculateSummary() {
    this.totalBill = this.bills.reduce((sum, bill) => sum + bill.total_cost, 0);
    this.totalBillChange.emit(this.totalBill);
    // Discount, payable, amountPaid, unpaidAmount will be set after fetching payment info (to be implemented)
    this.discount = 0;
    this.payable = this.totalBill;
    this.amountPaid = 0;
    this.unpaidAmount = this.payable;
  }

  onAddBill() {
    this.addBill.emit();
  }

  onGenerateFinalBill() {
    this.generateFinalBill.emit();
  }

  onClose() {
    this.close.emit();
  }

  onDeleteBill(bill: any) {
    if (this.paymentStatus !== 'UNPAID') return;
    if (!confirm('Are you sure you want to delete this bill?')) return;
    this.doctorsService.deleteBillFromAppointment(this.appointmentId, bill.id).subscribe({
      next: () => {
        this.toastr.success('Bill deleted successfully!');
        this.fetchBills();
        this.billsChanged.emit();
      },
      error: () => {
        this.toastr.error('Failed to delete bill.');
      }
    });
  }

  refreshBills() {
    this.fetchBills();
  }
} 