import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientListComponent } from '../patient-list/patient-list.component';
import { DiagnosisListComponent } from '../diagnosis-list/diagnosis-list.component';
import { WardListComponent } from '../ward-list/ward-list.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { LoginGuard } from './login.guard';
import { NotLoggedInGuard } from './not-logged-in.guard';

const routes: Routes = [
  { path: 'patients', component: PatientListComponent, canActivate: [NotLoggedInGuard] },
  { path: 'diagnoses', component: DiagnosisListComponent, canActivate: [NotLoggedInGuard] },
  { path: 'wards', component: WardListComponent, canActivate: [NotLoggedInGuard] },
  { path: 'login', component: LoginFormComponent, canActivate: [LoginGuard] },
  { path: '**', redirectTo: 'patients' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
