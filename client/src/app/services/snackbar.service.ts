import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(
    private snackBar: MatSnackBar
  ) { }

  public showInfoSnackbar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      panelClass: ['info-snackbar']
    });
  }

  public showErrorSnackbar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
