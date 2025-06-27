import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink, NavbarComponent, CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  features = [
    {
      icon: 'support_agent',
      title: '24/7 Support',
      description: 'Round-the-clock technical support and assistance.'
    },
    {
      icon: 'people',
      title: 'Patient Management',
      description: 'Complete patient records, history, and care management system.'
    },
    {
      icon: 'event',
      title: 'Appointment Scheduling',
      description: 'Efficient scheduling system for patients and healthcare providers.'
    },
    {
      icon: 'description',
      title: 'Electronic Health Records',
      description: 'Secure and accessible electronic health records management.'
    },
    {
      icon: 'monitor_heart',
      title: 'Clinical Management',
      description: 'Advanced tools for clinical workflow and patient care.'
    },
    {
      icon: 'inventory_2',
      title: 'Inventory Management',
      description: 'Track and manage medical supplies and equipment.'
    },
    {
      icon: 'payments',
      title: 'Billing & Payments',
      description: 'Streamlined billing processes and payment management.'
    },
    {
      icon: 'analytics',
      title: 'Analytics & Reports',
      description: 'Comprehensive reporting and analytics dashboard.'
    },
    {
      icon: 'business',
      title: 'Hospital Management',
      description: 'Comprehensive tools for managing hospital operations, resources, and staff.'
    },
  ];
} 