import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration-from',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent {
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirmation: ['', Validators.required],
    isAdmin: [false, Validators.required]
  });

  constructor(
    private fb: FormBuilder
  ) { }

  get username() { return this.form.get('username'); }

  get password() { return this.form.get('password'); }

  get confirmation() { return this.form.get('confirmation'); }

  get isAdmin() { return this.form.get('isAdmin'); }
}
