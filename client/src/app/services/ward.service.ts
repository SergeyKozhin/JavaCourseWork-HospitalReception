import { Injectable } from '@angular/core';
import { LoggingService } from './logging.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Ward } from '../doamain/Ward';
import { catchError, tap } from 'rxjs/operators';
import { logger } from "codelyzer/util/logger";

@Injectable({
  providedIn: 'root'
})
export class WardService {
  private wardUrl = 'wards';
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

  getWards(params: { name: string }): Observable<Ward[]> {
    return this.http.get<Ward[]>(this.wardUrl, { params })
      .pipe(
        tap(_ => this.logger.log('fetched wards')),
        catchError(WardService.handleError)
      );
  }

  getWard(id: bigint): Observable<Ward> {
    return this.http.get<Ward>(`${this.wardUrl}/${id}`)
      .pipe(
        tap(_ => this.logger.log(`fetched ward id=${id}`)),
        catchError(WardService.handleError)
      );
  }

  updateWard(ward: Ward): Observable<any> {
    return this.http.put<Ward>(`${this.wardUrl}/${ward.id}`, ward, this.httpOptions)
      .pipe(
        tap(_ => this.logger.log(`updated ward id=${ward.id}`)),
        catchError(WardService.handleError)
      );
  }

  addWard(ward: Ward): Observable<Ward> {
    return this.http.post<Ward>(this.wardUrl, ward, this.httpOptions)
      .pipe(
        tap((newWard: Ward) => this.logger.log(`added ward id=${newWard.id}`)),
        catchError(WardService.handleError)
      );
  }

  deleteWard(ward: Ward | bigint): Observable<Ward> {
    const id = typeof ward === 'bigint' ? ward : ward.id;

    return this.http.delete<any>(`${this.wardUrl}/${id}`, this.httpOptions)
      .pipe(
        tap(_ => this.logger.log(`deleted ward id=${id}`)),
        catchError(WardService.handleError)
      );
  }
}
