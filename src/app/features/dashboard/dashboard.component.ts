import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userRole: string = '';

  constructor(private authService: AuthService) {
    console.log('Dashboard component initialized');
  }

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
    console.log('Dashboard initialized with user role:', this.userRole);
  }
} 