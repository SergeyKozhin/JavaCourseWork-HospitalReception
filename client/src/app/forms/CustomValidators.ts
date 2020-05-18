import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export function uniqueValidator(data: { name: string }[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const notUnique = data?.find(el => el.name.toLowerCase() === control.value.toLowerCase()) !== undefined;
    return notUnique ? { notUnique: { value: control.value } } : null;
  };
}

export const confirmationValidator: ValidatorFn = (control: FormGroup) => {
  const password = control.get('password');
  const confirmation = control.get('confirmation');
  const nonEqual = password.value !== confirmation.value;

  if (nonEqual) {
    confirmation.setErrors({ confirmationNotMatch: true });
  }

  return nonEqual ? { confirmationNotMatch: true } : null;
};

export function uniqueUsernameValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors> | null => {
    const username = control.value;
    return authService.checkUnique(username)
      .pipe(
        map(unique => unique ? null : { usernameNotUnique: true }),
        catchError(_ => of(null))
      );
  };
}
