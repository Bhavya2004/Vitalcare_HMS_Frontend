import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { SIDEBAR_LINKS } from './sidebar-links';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  sidebarLinks = SIDEBAR_LINKS;
  role: string = '';
  section: any;
  link: any;

  constructor(private authService: AuthService) {
    console.log('SidebarComponent initialized');
  }

  ngOnInit(): void {
    // Get the user's role
    this.role = this.authService.getRole();
    console.log('Current user role:', this.role);
  }

  // Check if the user has access to a specific link
  hasAccess(access: string[]): boolean {
    const hasAccess = access.includes(this.role);
    console.log(`Checking access for role ${this.role} against ${access.join(', ')}: ${hasAccess}`);
    return hasAccess;
  }
}
