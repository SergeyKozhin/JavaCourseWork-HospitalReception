import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-login-from',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  failed = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) { }

  onSubmit() {
    this.authService.login(this.form.value)
      .subscribe(success => {
          if (success) {
            this.router.navigate(['']).finally();
          } else {
            this.failed = true;
          }
        },
        error => this.snackbarService.showErrorSnackbar(`Couldn't login: ${error}`));
  }

  get username() { return this.form.get('username'); }

  get password() { return this.form.get('password'); }
}


