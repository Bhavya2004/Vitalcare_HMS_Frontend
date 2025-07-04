import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PatientService } from '../services/patient.service';
import { Observable, map, catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class PatientRegistrationGuard implements CanActivate {
  private readonly registrationRoute = '/patient/register';
  private readonly dashboardRoute = '/dashboard';

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  /**
   * Determines whether a route can be activated based on the patient's registration status.
   * 
   * @param route - The activated route snapshot containing route information.
   * @returns An observable that emits `true` if the route can be activated, or `false` otherwise.
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    // Bypass this registration logic for non-patient roles
    if (this.authService.getRole() !== 'PATIENT') {
      return of(true);
    }

    return this.patientService.checkPatientRegistration().pipe(
      map((isRegistered) => this.handleRouteActivation(isRegistered, route)),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Handles route activation logic based on the patient's registration status.
   * 
   * @param isRegistered - Whether the patient is registered.
   * @param route - The activated route snapshot.
   * @returns `true` if the route can be activated, `false` otherwise.
   */
  private handleRouteActivation(isRegistered: boolean, route: ActivatedRouteSnapshot): boolean {
    const isRegistrationRoute = route.routeConfig?.path === 'patient/register';

    if (!isRegistered && !isRegistrationRoute) {
      this.router.navigate([this.registrationRoute]);
      return false;
    }

    if (isRegistered && isRegistrationRoute) {
      this.router.navigate([this.dashboardRoute]);
      return false;
    }

    return true;
  }

  /**
   * Handles errors that occur during the registration status check.
   * 
   * @param error - The error object.
   * @returns An observable that emits `false`.
   */
  private handleError(error: any): Observable<boolean> {
    console.error('Error checking patient registration:', error);
    this.toastr.error('Unable to check registration status. Please try again later.');
    this.router.navigate([this.registrationRoute]);
    return of(false);
  }
}