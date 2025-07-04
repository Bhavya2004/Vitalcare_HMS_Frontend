import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, NavbarComponent, CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  stats = [
    { number: '10+', label: 'Years Experience' },
    { number: '50+', label: 'Healthcare Partners' },
    { number: '100K+', label: 'Patients Served' },
    { number: '24/7', label: 'Support Available' }
  ];
} 