import { Injectable } from '@angular/core';
import { LoggingService } from './logging.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Diagnosis } from './Diagnosis';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService {
  private diagnosisUrl = 'diagnosis';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor(
    private logger: LoggingService,
    private http: HttpClient
  ) { }

  getDiagnoses(): Observable<Diagnosis[]> {
    return this.http.get<Diagnosis[]>(this.diagnosisUrl)
      .pipe(
        tap(_ => this.logger.log('fetched diagnoses')),
        catchError(this.handleError<Diagnosis[]>('getDiagnoses', []))
      );
  }

  getDiagnosis(id: bigint): Observable<Diagnosis> {
    return this.http.get<Diagnosis>(`${this.diagnosisUrl}/${id}`)
      .pipe(
        tap(_ => this.logger.log(`fetched diagnosis id=${id}`)),
        catchError(this.handleError<Diagnosis>('getDiagnosis'))
      );
  }

  updateDiagnosis(diagnosis: Diagnosis): Observable<any> {
    return this.http.put<Diagnosis>(`${this.diagnosisUrl}/${diagnosis.id}`, diagnosis, this.httpOptions)
      .pipe(
        tap(_ => this.logger.log(`updated diagnosis id=${diagnosis.id}`)),
        catchError(this.handleError<any>('updateDiagnosis'))
      );
  }

  addDiagnosis(diagnosis: Diagnosis): Observable<Diagnosis> {
    return this.http.post<Diagnosis>(this.diagnosisUrl, diagnosis, this.httpOptions)
      .pipe(
        tap((newDiagnosis: Diagnosis) => this.logger.log(`added diagnosis id=${newDiagnosis.id}`)),
        catchError(this.handleError<Diagnosis>('addDiagnosis'))
      );
  }

  deleteDiagnosis(diagnosis: Diagnosis | bigint): Observable<Diagnosis> {
    const id = typeof diagnosis === 'bigint' ? diagnosis : diagnosis.id;

    return this.http.delete<any>(`${this.diagnosisUrl}/${id}` )
      .pipe(
        tap(_ => this.logger.log(`deleted diagnosis id=${id}`)),
        catchError(this.handleError<any>('deleteDiagnosis'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logger.error(`${operation}
  failed: ${error.message}
`);
      return of(result as T);
    };
  }
}
