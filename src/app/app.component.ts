import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HttpClient } from '@angular/common/http';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent,RouterOutlet,HomeComponent,LoginComponent,RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  showSidebar: boolean = true;

  constructor(private router: Router) {
    // Listen to route changes and toggle the sidebar visibility
    this.router.events.subscribe(() => {
      // Hide the sidebar for specific routes (e.g., homepage)
      const currentRoute = this.router.url;
      this.showSidebar = currentRoute !== '/'; // Sidebar is hidden for '/'
    });
  }
}
