import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { confirmationValidator, uniqueUsernameValidator } from '../CustomValidators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration-from',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent {
  form = this.fb.group({
    username: ['', Validators.required, uniqueUsernameValidator(this.authService)],
    password: ['', Validators.required],
    confirmation: ['', Validators.required],
    isAdmin: [false, Validators.required]
  }, { validators: confirmationValidator });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  get username() { return this.form.get('username'); }

  get password() { return this.form.get('password'); }

  get confirmation() { return this.form.get('confirmation'); }

  get isAdmin() { return this.form.get('isAdmin'); }
}
