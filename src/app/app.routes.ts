import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PatientRegisterComponent } from './features/patient/register/patient-register/patient-register.component';
import { PatientRegistrationGuard } from './core/guards/patient-registration.guard';
import { AppointmentsComponent } from './features/patient/appointments/appointments.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // Homepage
    { path: 'sign-in', component: LoginComponent }, // Login page
    { path: 'sign-up', component: RegisterComponent }, // Register page
    { 
        path: 'patient/register', 
        component: PatientRegisterComponent,
        canActivate: [AuthGuard, PatientRegistrationGuard]
    },
    { 
        path: 'dashboard', 
        component: DashboardComponent, 
        canActivate: [AuthGuard, PatientRegistrationGuard]
    },
    {
        path:'appointments',
        component: AppointmentsComponent,
        canActivate: [AuthGuard]
    },
    { path: '**', redirectTo: '' } // Redirect invalid routes to home
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
