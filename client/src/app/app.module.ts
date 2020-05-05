import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DiagnosisListComponent } from './diagnosis-list/diagnosis-list.component';
import { environment } from '../environments/environment';
import { BaseUrlInterceptor } from './base-url.interceptor';
import { WardListComponent } from './ward-list/ward-list.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AppRoutingModule } from './app-routing.module';
import { MatTableModule } from '@angular/material/table';
import { PatientTableComponent } from './patient-table/patient-table.component';

@NgModule({
  declarations: [
    AppComponent,
    DiagnosisListComponent,
    WardListComponent,
    PatientListComponent,
    NavigationComponent,
    PatientTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    AppRoutingModule,
    MatTableModule,
  ],
  providers: [
    { provide: 'BASE_API_URL', useValue: environment.apiUrl },
    {provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
