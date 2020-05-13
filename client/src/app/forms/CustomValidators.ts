import { AbstractControl, ValidatorFn } from '@angular/forms';

export function uniqueValidator(data: { name: string }[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const notUnique = data?.find(el => el.name === control.value) !== undefined;
    return notUnique ? { notUnique: { value: control.value } } : null;
  };
}
