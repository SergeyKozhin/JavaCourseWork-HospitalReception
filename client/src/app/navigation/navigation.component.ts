import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationFormComponent } from '../forms/registration-form/registration-form.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  @ViewChild('drawer') drawer: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isHandset: boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) {}

  logout() {
    this.authService.logout()
      .subscribe(success => {
          if (success) {
            this.router.navigate(['login']).finally();
          }
        },
        error => this.snackbarService.showErrorSnackbar(`Couldn't logout: ${error}`));
  }

  ngOnInit(): void {
    this.isHandset$
      .subscribe(handset => this.isHandset = handset);
  }

  closeIfHandset() {
    if (this.isHandset) {
      this.drawer.toggle().finally();
    }
  }

  register() {
    this.dialog.open(RegistrationFormComponent)
      .afterClosed().subscribe(data => {
      if (data) {
        this.authService.registerUser({ ...data, role: data.isAdmin ? 'ROLE_ADMIN' : 'ROLE_USER' })
          .subscribe(_ => this.snackbarService.showInfoSnackbar('New user successfully registered'),
            error => this.snackbarService.showErrorSnackbar(`Couldn't register user: ${error}`));
      }
    });
  }
}
