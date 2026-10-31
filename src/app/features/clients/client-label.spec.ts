import { describe, expect, it } from 'vitest';
import { clientConfirmationLabel, clientInitials, clientLabel, clientName } from './client-label';

describe('client labels', () => {
  it('survives missing names', () => {
    expect(clientName(null)).toBe('Unknown');
    expect(clientName({ firstName: 'Ann' })).toBe('Ann');
    expect(clientInitials(undefined)).toBe('?');
  });

  it('adds the email when there is one', () => {
    expect(clientLabel({ firstName: 'Ann', lastName: 'Lee', email: 'a@b.c' })).toBe('Ann Lee (a@b.c)');
    expect(clientLabel({ firstName: 'Ann', lastName: 'Lee' })).toBe('Ann Lee');
  });

  it('marks the company account', () => {
    expect(clientConfirmationLabel({ firstName: 'Nexus', lastName: 'Co', isSystem: true })).toBe('Nexus Co [COMPANY account]');
  });

  it('builds uppercase initials', () => {
    expect(clientInitials({ firstName: 'ann', lastName: 'lee' })).toBe('AL');
  });
});
