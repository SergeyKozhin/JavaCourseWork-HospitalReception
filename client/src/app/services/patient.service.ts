import { Injectable } from '@angular/core';
import { LoggingService } from './logging.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Patient } from '../doamain/Patient';
import { catchError, tap } from 'rxjs/operators';
import { PatientSearchParameters } from './PatientSearchParameters';
import { PagingParameters } from './PagingParameters';
import { Page } from '../doamain/Page';
import { logger } from 'codelyzer/util/logger';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patientUrl = 'patients';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  constructor(
    private logger: LoggingService,
    private http: HttpClient
  ) { }

  private static handleError(error: HttpErrorResponse) {
    logger.error(`Server error: ${error.message}`);
    return throwError(`Something went wrong: ${error.message}`);
  }

  getPatientsPage(params: PatientSearchParameters & PagingParameters) {
    return this.http.get<Page<Patient>>(`${this.patientUrl}/page`, { params: params as any })
      .pipe(
        tap(page => this.logger.log(`fetched patients page number ${page.number}`)),
        catchError(PatientService.handleError)
      );
  }

  getPatients(params: PatientSearchParameters): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.patientUrl, { params: params as any })
      .pipe(
        tap(_ => this.logger.log('fetched patients')),
        catchError(PatientService.handleError)
      );
  }

  getPatient(id: bigint): Observable<Patient> {
    return this.http.get<Patient>(`${this.patientUrl}/${id}`)
      .pipe(
        tap(_ => this.logger.log(`fetched patient id=${id}`)),
        catchError(PatientService.handleError)
      );
  }

  updatePatient(patient: Patient): Observable<any> {
    return this.http.put<Patient>(`${this.patientUrl}/${patient.id}`, patient, this.httpOptions)
      .pipe(
        tap(_ => this.logger.log(`updated patient id=${patient.id}`)),
        catchError(PatientService.handleError)
      );
  }

  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.patientUrl, patient, this.httpOptions)
      .pipe(
        tap((newPatient: Patient) => this.logger.log(`added patient id=${newPatient.id}`)),
        catchError(PatientService.handleError)
      );
  }

  deletePatient(patient: Patient | bigint): Observable<Patient> {
    const id = typeof patient === 'bigint' ? patient : patient.id;

    return this.http.delete<any>(`${this.patientUrl}/${id}`, this.httpOptions)
      .pipe(
        tap(_ => this.logger.log(`deleted patient id=${id}`)),
        catchError(PatientService.handleError)
      );
  }
}
