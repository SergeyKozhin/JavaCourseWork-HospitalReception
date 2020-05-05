import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DiagnosisListComponent } from './diagnosis-list/diagnosis-list.component';
import { environment } from '../environments/environment';
import { BaseUrlInterceptor } from './base-url.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    DiagnosisListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    { provide: 'BASE_API_URL', useValue: environment.apiUrl },
    {provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
