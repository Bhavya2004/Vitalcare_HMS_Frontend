import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { DoctorsService, WorkingDay , Doctor } from '../../../core/services/doctors.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-doctor',
  imports :[ReactiveFormsModule,CommonModule],
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.css']
})
export class AddDoctorComponent {
  @Output() close = new EventEmitter<boolean>();
  doctorForm: FormGroup;
  daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  constructor(private fb: FormBuilder, private doctorsService: DoctorsService) {
    this.doctorForm = this.fb.group({
      type: ['FULL', Validators.required],
      name: ['', Validators.required],
      specialization: ['', Validators.required],
      department: ['', Validators.required],
      license_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      working_days: this.fb.array(this.daysOfWeek.map(day => this.fb.group({
        day: [day],
        enabled: [false],
        start_time: ['09:00'],
        close_time: ['17:00']
      })))
    });
  }

  get workingDaysArray() {
    return this.doctorForm.get('working_days') as FormArray;
  }

  submit() {
    if (this.doctorForm.invalid) return;
    const formValue = this.doctorForm.value;
    const working_days: WorkingDay[] = formValue.working_days
      .filter((wd: any) => wd.enabled)
      .map((wd: any) => ({ day: wd.day, start_time: wd.start_time, close_time: wd.close_time }));
    const doctor: Doctor = {
      ...formValue,
      working_days
    };
    this.doctorsService.addDoctor(doctor).subscribe(() => {
      this.close.emit(true);
    });
  }

  cancel() {
    this.close.emit(false);
  }

  getWorkingDayGroup(index: number): FormGroup {
    return this.workingDaysArray.at(index) as FormGroup;
  }
} 