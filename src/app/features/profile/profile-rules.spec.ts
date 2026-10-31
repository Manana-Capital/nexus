import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { nameValidators, passwordsMatch } from './profile-rules';

const name = (value: string | null) => new FormControl(value, nameValidators).valid;
const passwords = (newPassword: string, newPasswordRepeat: string) =>
  passwordsMatch(new FormGroup({ newPassword: new FormControl(newPassword), newPasswordRepeat: new FormControl(newPasswordRepeat) }));

describe('name rules', () => {
  it('accepts 3 to 20 characters without digits and spaces', () => {
    expect(name('Ann')).toBe(true);
    expect(name('Žofie-Marie')).toBe(true);
  });

  it('rejects what the backend form never accepted', () => {
    expect(name(null)).toBe(false);
    expect(name('Al')).toBe(false);
    expect(name('Ann2')).toBe(false);
    expect(name('Ann Lee')).toBe(false);
    expect(name('a'.repeat(21))).toBe(false);
  });
});

describe('passwordsMatch', () => {
  it('compares both fields exactly', () => {
    expect(passwords('secret', 'secret')).toBeNull();
    expect(passwords('secret', 'Secret')).toEqual({ passwordsDiffer: true });
  });
});
