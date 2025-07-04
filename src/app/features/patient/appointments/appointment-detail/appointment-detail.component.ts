import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-appointment-detail',
  imports: [CommonModule],
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.css']
})
export class AppointmentDetailComponent {
  @Input() selectedAppointment: any;
  @Output() close = new EventEmitter<void>();

  getAge(dateOfBirth: string): string {
    if (!dateOfBirth) return '—';
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Handle age format
    if (age < 1) {
      // Calculate months for babies
      const months = today.getMonth() - birthDate.getMonth() + 
        (today.getFullYear() - birthDate.getFullYear()) * 12;
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    }
    
    return `${age} ${age === 1 ? 'year' : 'years'}`;
  }

  formatDate(date: string): string {
    if (!date) return '—';
    try {
      const dateObj = new Date(date);
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
      return dateObj.toLocaleDateString('en-US', options);
    } catch (e) {
      console.error('Error formatting date:', e);
      return date;
    }
  }

  formatTime(time: string): string {
    if (!time) return '—';
    
    try {
      // Handle different time formats
      if (time.includes(':')) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${period}`;
      }
      
      return time;
    } catch (e) {
      console.error('Error formatting time:', e);
      return time;
    }
  }

  getStatusColor(status: string): string {
    status = status.toLowerCase();
    
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-confirmed';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPatientImgUrl(imgPath: string | undefined): string {
    if (!imgPath) return '';
    return `http://localhost:3000${imgPath}`;
  }
}
