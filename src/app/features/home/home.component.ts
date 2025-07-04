import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Original component without the auto-redirect logic
}
