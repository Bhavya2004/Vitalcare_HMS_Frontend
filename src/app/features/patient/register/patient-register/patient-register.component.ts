import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../../../core/services/patient.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';
import { SidebarComponent } from '../../../../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-patient-register',
  templateUrl: './patient-register.component.html',
  styleUrls: ['./patient-register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent]
})
export class PatientRegisterComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  registrationForm: FormGroup;
  isSubmitting = false;
  fieldErrors: { [key: string]: string } = {};
  errorMessage: string = '';
  imagePreview: string | null = null;
  selectedImageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.registrationForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      marital_status: ['', Validators.required],
      address: ['', Validators.required],
      emergency_contact_name: ['', Validators.required],
      emergency_contact_number: ['', [Validators.required, Validators.minLength(10)]],
      relation: ['', Validators.required],
      blood_group: [''],
      allergies: [''],
      medical_conditions: [''],
      medical_history: [''],
      insurance_provider: [''],
      insurance_number: [''],
      privacy_consent: [false, Validators.requiredTrue],
      service_consent: [false, Validators.requiredTrue],
      medical_consent: [false, Validators.requiredTrue],
      img: [''],
      colorCode: ['']
    });
  }

  ngOnInit(): void {
    // Check if user is a patient
    if (this.authService.getRole() !== 'PATIENT') {
      this.toastr.error('Access denied. This page is only for patients.');
      this.router.navigate(['/dashboard']);
      return;
    }

    // Check if user has already registered as a patient
    this.patientService.checkPatientRegistration().subscribe({
      next: (isRegistered) => {
        if (isRegistered) {
          this.toastr.info('You have already registered as a patient');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('Error checking patient registration:', error);
        this.toastr.error('Unable to check registration status. Please try again later.');
      }
    });
  }

  onSubmit(): void {
    this.fieldErrors = {};
    this.errorMessage = '';

    if (this.registrationForm.valid) {
      this.isSubmitting = true;
      
      // Get form values
      const formData = this.registrationForm.value;
      
      // Remove the img field from formData if it exists (we'll send the file separately)
      if (formData.img) {
        delete formData.img;
      }
      
      this.patientService.registerPatient(formData, this.selectedImageFile || undefined).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.toastr.success('Patient registration successful!', 'Welcome to VitalCare HMS');
          
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error.error?.errors) {
            error.error.errors.forEach((err: any) => {
              if (err.field) {
                this.fieldErrors[err.field] = err.message;
              } else {
                this.errorMessage = err.message;
              }
            });
          } else {
            this.errorMessage = error.error?.message || 'An error occurred during registration';
          }
          this.toastr.error(this.errorMessage || 'Registration failed');
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  // Helper method to check if a field has errors
  hasError(fieldName: string): boolean {
    const control = this.registrationForm.get(fieldName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  // Helper method to get error message
  getErrorMessage(fieldName: string): string {
    const control = this.registrationForm.get(fieldName);
    if (control && control.errors) {
      if (control.errors['required']) {
        return `${fieldName.replace('_', ' ')} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `${fieldName.replace('_', ' ')} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        this.toastr.error('Please select an image file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.toastr.error('Image size should not exceed 5MB');
        return;
      }

      // Store the file object for later use
      this.selectedImageFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
