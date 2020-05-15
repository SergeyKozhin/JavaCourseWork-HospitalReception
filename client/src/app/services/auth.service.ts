import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthResponse } from './AuthResponse';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private username: string;
  private roles: string[];
  private jwtToken: string;
  private authUrl = 'auth';
  private refreshTokenCookie = 'REFRESH_TOKEN';

  constructor(
    private http: HttpClient,
    private cookies: CookieService
  ) { }

  public login(user: { username: string, password: string }): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, user)
      .pipe(
        tap(response => this.doLogin(response)),
        mapTo(true),
        catchError(error => {
          console.error(error);
          return of(false);
        })
      );
  }

  public logout(): Observable<boolean> {
    return this.http.delete(`${this.authUrl}/logout`,
      { params: { refreshToken: this.getRefreshToken() } })
      .pipe(
        tap(_ => this.doLogout()),
        mapTo(true),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 401) {
            this.doLogout();
            return of(true);
          }
          return of(false);
        })
      );
  }

  public refreshToken(): Observable<string> {
    return this.http.post<{ jwtToken: string }>(`${this.authUrl}/refresh`,
      {}, { params: { refreshToken: this.getRefreshToken() } })
      .pipe(
        tap(response => this.jwtToken = response.jwtToken),
        map(response => response.jwtToken),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 401) {
            this.doLogout();
            return of('');
          }

          return throwError(error);
        }));
  }

  public isLoggedIn(): boolean {
    return this.cookies.check(this.refreshTokenCookie);
  }

  public isAdmin(): boolean {
    return this.roles?.includes('ROLE_ADMIN');
  }

  public getJwtToken() {
    return this.jwtToken;
  }

  private doLogin(response: AuthResponse) {
    this.username = response.username;
    this.roles = response.roles;
    this.jwtToken = response.jwtToken;
    this.cookies.set(this.refreshTokenCookie, response.refreshToken);
  }

  private doLogout() {
    this.username = null;
    this.roles = [];
    this.jwtToken = null;
    this.cookies.delete(this.refreshTokenCookie);
  }

  private getRefreshToken() {
    return this.cookies.get(this.refreshTokenCookie);
  }
}
