import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

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
