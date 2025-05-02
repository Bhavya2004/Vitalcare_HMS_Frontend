import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { AuthService } from '../../core/services/auth.service';
import { AppointmentService } from '../../core/services/appointment.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userRole: string = '';
  appointmentCount: number = 0;

  constructor(private authService: AuthService,private appointmentService:AppointmentService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
   this.loadAppointmentCount();
  }

  loadAppointmentCount():void{
    this.appointmentService.getAppointmentCount().subscribe({
      next:(response)=>{
        this.appointmentCount=response.data.count;
      },
      error:(error)=>{
        console.error('Error fetching appointment count:', error);
      }
    })
  }
} 