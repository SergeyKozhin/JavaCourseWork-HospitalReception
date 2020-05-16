import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) { }

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  private static addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isLoggedIn() && !request.url.includes('logout') && !request.url.includes('refresh')) {
      request = AuthInterceptor.addToken(request, this.authService.getJwtToken());
    }

    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && !request.url.includes('logout') && !request.url.includes('refresh')) {
            return this.handleUnauthorized(request, next);
          } else {
            return throwError(error);
          }
        })
      );
  }

  private handleUnauthorized(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap(token => {
          if (token) {
            this.refreshTokenSubject.next(token);
            return next.handle(AuthInterceptor.addToken(request, token));
          }

          return this.logout();
        }),
        catchError(_ => this.logout()),
        finalize(() => {
          this.isRefreshing = false;
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(AuthInterceptor.addToken(request, jwt));
        }));
    }
  }

  private logout() {
    this.authService.logout().subscribe();
    return throwError('');
  }

}
