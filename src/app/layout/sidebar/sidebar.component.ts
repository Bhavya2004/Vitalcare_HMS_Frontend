import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { SIDEBAR_LINKS } from './sidebar-links';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  sidebarLinks = SIDEBAR_LINKS;
  role: string;
  section: any;
  link: any;

  constructor(private authService: AuthService) {
    // Fetch the user's role
    this.role = this.authService.getRole();
  }

  // Check if the user has access to a specific link
  hasAccess(access: string[]): boolean {
    return access.includes(this.role);
  }

}
