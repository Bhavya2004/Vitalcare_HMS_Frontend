import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  showSidebar: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Listen to route changes and toggle the sidebar visibility
    this.router.events.subscribe(() => {
      // Show sidebar for all routes except homepage and auth pages
      const currentRoute = this.router.url;
      this.showSidebar = this.authService.checkAuth() && 
        !['/', '/sign-in', '/sign-up'].includes(currentRoute);
    });
  }
}
