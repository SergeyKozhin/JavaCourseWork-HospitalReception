import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientListComponent } from './patient-list/patient-list.component';
import { DiagnosisListComponent } from './diagnosis-list/diagnosis-list.component';
import { WardListComponent } from './ward-list/ward-list.component';
import { LoginFormComponent } from './login-from/login-form.component';

const routes: Routes = [
  { path: 'patients', component: PatientListComponent },
  { path: 'diagnoses', component: DiagnosisListComponent },
  { path: 'wards', component: WardListComponent },
  { path: 'login', component: LoginFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
