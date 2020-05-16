import { Injectable } from '@angular/core';
import { LoggingService } from './logging.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Diagnosis } from '../doamain/Diagnosis';
import { catchError, tap } from 'rxjs/operators';
import { logger } from 'codelyzer/util/logger';

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService {

  constructor(
    private logger: LoggingService,
    private http: HttpClient
  ) { }

  private diagnosisUrl = 'diagnosis';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  private static handleError(error: HttpErrorResponse) {
    logger.error(`Server error: ${error.message}`);
    return throwError(`Something went wrong: ${error.message}`);
  }

  getDiagnoses(params: { name: string }): Observable<Diagnosis[]> {
    return this.http.get<Diagnosis[]>(this.diagnosisUrl, { params })
      .pipe(
        tap(_ => this.logger.log('fetched diagnoses')),
        catchError(DiagnosisService.handleError)
      );
  }

  getDiagnosis(id: bigint): Observable<Diagnosis> {
    return this.http.get<Diagnosis>(`${this.diagnosisUrl}/${id}`)
      .pipe(
        tap(_ => this.logger.log(`fetched diagnosis id=${id}`)),
        catchError(DiagnosisService.handleError)
      );
  }

  updateDiagnosis(diagnosis: Diagnosis): Observable<any> {
    return this.http.put<Diagnosis>(`${this.diagnosisUrl}/${diagnosis.id}`, diagnosis, this.httpOptions)
      .pipe(
        tap(_ => this.logger.log(`updated diagnosis id=${diagnosis.id}`)),
        catchError(DiagnosisService.handleError)
      );
  }

  addDiagnosis(diagnosis: Diagnosis): Observable<Diagnosis> {
    return this.http.post<Diagnosis>(this.diagnosisUrl, diagnosis, this.httpOptions)
      .pipe(
        tap((newDiagnosis: Diagnosis) => this.logger.log(`added diagnosis id=${newDiagnosis.id}`)),
        catchError(DiagnosisService.handleError)
      );
  }

  deleteDiagnosis(diagnosis: Diagnosis | bigint): Observable<Diagnosis> {
    const id = typeof diagnosis === 'bigint' ? diagnosis : diagnosis.id;

    return this.http.delete<any>(`${this.diagnosisUrl}/${id}`, this.httpOptions)
      .pipe(
        tap(_ => this.logger.log(`deleted diagnosis id=${id}`)),
        catchError(DiagnosisService.handleError)
      );
  }
}
