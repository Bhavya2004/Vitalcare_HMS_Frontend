import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  
  contactInfo = [
    {
      icon: 'location_on',
      title: 'Visit Us',
      details: ['123 Healthcare Avenue', 'Medical District', 'Ahmedabad, Gujarat, 380001']
    },
    {
      icon: 'call',
      title: 'Call Us',
      details: ['+91 1234567890', '+91 0987654321']
    },
    {
      icon: 'email',
      title: 'Email Us',
      details: ['support@vitalcare.com', 'info@vitalcare.com']
    },
    {
      icon: 'schedule',
      title: 'Working Hours',
      details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 1:00 PM']
    }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      // Here you would typically send the form data to your backend
      console.log(this.contactForm.value);
      // Reset form after submission
      this.contactForm.reset();
      // You could also show a success message to the user
    }
  }

  // Helper methods for form validation
  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }
} 