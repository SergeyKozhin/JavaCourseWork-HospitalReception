import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthResponse } from './AuthResponse';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtToken: string;
  private authUrl = 'auth';
  private readonly usernameKey = 'USERNAME';
  private readonly rolesKey = 'ROLES';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public login(user: { username: string, password: string }): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, user, { withCredentials: true })
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
    return this.http.delete(`${this.authUrl}/logout`, { withCredentials: true })
      .pipe(
        tap(_ => this.doLogout()),
        mapTo(true),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 400 || error.status === 401) {
            this.doLogout();
            return of(true);
          }
          return of(false);
        })
      );
  }

  public refreshToken(): Observable<string> {
    return this.http.post<{ jwtToken: string }>(`${this.authUrl}/refresh`,{}, { withCredentials: true })
      .pipe(
        tap(response => this.jwtToken = response.jwtToken),
        map(response => response.jwtToken),
        catchError(error => {
          console.error(error);
          return throwError(error);
        }));
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem(this.usernameKey) != null;
  }

  public isAdmin(): boolean {
    return this.getRoles().includes('ROLE_ADMIN');
  }

  public getJwtToken() {
    return this.jwtToken;
  }

  public getUsername() {
    return localStorage.getItem(this.usernameKey);
  }

  private doLogin(response: AuthResponse) {
    localStorage.setItem(this.usernameKey, response.username);
    localStorage.setItem(this.rolesKey, JSON.stringify(response.roles));
    this.jwtToken = response.jwtToken;
  }

  private doLogout() {
    localStorage.removeItem(this.usernameKey);
    localStorage.removeItem(this.rolesKey);
    this.jwtToken = null;
    this.router.navigate(['login']).finally();
  }

  private getRoles() {
    return JSON.parse(localStorage.getItem(this.rolesKey));
  }
}
