import { style, transition, trigger, animate } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DoctorsService } from '../../../../core/services/doctors.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-vitals-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-vitals-modal.component.html',
  styleUrls: ['./add-vitals-modal.component.css'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class AddVitalsModalComponent implements OnInit {
  @Input() appointmentId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() vitalsAdded = new EventEmitter<any>();

  vitalsForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorsService,
    private toastr: ToastrService
  ) {
    this.vitalsForm = this.fb.group({
      body_temperature: ['', [Validators.required, Validators.min(35), Validators.max(43)]],
      heart_rate: ['', Validators.required],
      systolic: ['', [Validators.required, Validators.min(70), Validators.max(190)]],
      diastolic: ['', [Validators.required, Validators.min(40), Validators.max(100)]],
      weight: ['', [Validators.required, Validators.min(1)]],
      height: ['', [Validators.required, Validators.min(50)]],
      respiratory_rate: [''],
      oxygen_saturation: [''],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.vitalsForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }
    this.isSubmitting = true;
    const formData = this.vitalsForm.value;

    // Convert to numbers where appropriate
    const payload = {
      ...formData,
      body_temperature: parseFloat(formData.body_temperature),
      systolic: parseInt(formData.systolic, 10),
      diastolic: parseInt(formData.diastolic, 10),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      respiratory_rate: formData.respiratory_rate ? parseInt(formData.respiratory_rate, 10) : null,
      oxygen_saturation: formData.oxygen_saturation ? parseInt(formData.oxygen_saturation, 10) : null,
    };
    
    this.doctorService.addVitalSigns(this.appointmentId, payload).subscribe({
        next: (newVitals: any) => {
            this.isSubmitting = false;
            this.toastr.success('Vital signs added successfully!');
            this.vitalsAdded.emit(newVitals);
            this.close.emit();
        },
        error: (err: any) => {
            this.isSubmitting = false;
            this.toastr.error('Failed to add vital signs.');
            console.error(err);
        }
    });
  }
}
