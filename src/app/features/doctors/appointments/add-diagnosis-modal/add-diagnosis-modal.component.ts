import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DoctorsService } from '../../../../core/services/doctors.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-diagnosis-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-diagnosis-modal.component.html',
  styleUrls: ['./add-diagnosis-modal.component.css']
})
export class AddDiagnosisModalComponent {
  @Input() appointmentId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() diagnosisAdded = new EventEmitter<any>();

  form: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorsService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      symptoms: ['', Validators.required],
      diagnosis: ['', Validators.required],
      prescribed_medications: [''],
      notes: [''],
      follow_up_plan: ['']
    });
  }

  submit() {
    if (this.form.invalid || !this.appointmentId) return;
    this.isSubmitting = true;
    this.doctorService.addDiagnosisForAppointment(this.appointmentId, this.form.value).subscribe({
      next: (diagnosis) => {
        this.toastr.success('Diagnosis added successfully!');
        this.diagnosisAdded.emit(diagnosis);
        this.close.emit();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.toastr.error('Failed to add diagnosis.');
        this.isSubmitting = false;
      }
    });
  }

  onClose() {
    this.close.emit();
  }
}
