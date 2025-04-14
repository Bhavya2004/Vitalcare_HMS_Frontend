import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PatientService } from '../services/patient.service';
import { Observable, map, catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PatientRegistrationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    // Only check registration for patients
    if (this.authService.getRole() !== 'PATIENT') {
      return of(true);
    }

    return this.patientService.checkPatientRegistration().pipe(
      map(isRegistered => {
        const isRegistrationRoute = route.routeConfig?.path === 'patient/register';
        
        if (!isRegistered && !isRegistrationRoute) {
          // If not registered and trying to access any route other than registration,
          // redirect to registration
          this.router.navigate(['/patient/register']);
          return false;
        }
        
        if (isRegistered && isRegistrationRoute) {
          // If already registered and trying to access registration page,
          // redirect to dashboard
          this.router.navigate(['/dashboard']);
          return false;
        }
        
        // Allow access in all other cases
        return true;
      }),
      catchError((error) => {
        console.error('Error checking patient registration:', error);
        this.toastr.error('Unable to check registration status. Please try again later.');
      // Redirect to registration page on error
      this.router.navigate(['/patient/register']);
      return of(false);
      })
    );
  }
} 