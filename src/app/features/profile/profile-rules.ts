import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export const ROLE_OPTIONS = [
  { label: 'Fund client', value: 'Client' },
  { label: 'Company employee', value: 'Employee' },
  { label: 'Company manager', value: 'Manager' },
  { label: 'System administrator', value: 'Admin' },
];

export const nameValidators = [Validators.required, Validators.pattern('[^0-9 ]{3,20}$')];

export function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const { newPassword, newPasswordRepeat } = group.getRawValue();
  return newPassword === newPasswordRepeat ? null : { passwordsDiffer: true };
}
