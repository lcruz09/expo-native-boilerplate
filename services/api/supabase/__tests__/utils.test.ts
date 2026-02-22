import { PostgrestError } from '@supabase/supabase-js';
import { handleAuthError, handleDatabaseError } from '../utils';

describe('handleAuthError', () => {
  it('returns the error message', () => {
    const result = handleAuthError({ message: 'Invalid credentials' });
    expect(result.message).toBe('Invalid credentials');
  });

  it('returns a fallback message when no message is present', () => {
    const result = handleAuthError({});
    expect(result.message).toBe('An unexpected authentication error occurred');
  });

  it('maps HTTP status to a code string', () => {
    const result = handleAuthError({ message: 'Unauthorized', status: 401 });
    expect(result.code).toBe('401');
  });

  it('falls back to error.code when status is absent', () => {
    const result = handleAuthError({
      message: 'Email not confirmed',
      code: 'email_not_confirmed',
    });
    expect(result.code).toBe('email_not_confirmed');
  });

  it('returns undefined code when neither status nor code are present', () => {
    const result = handleAuthError({ message: 'Unknown error' });
    expect(result.code).toBeUndefined();
  });
});

describe('handleDatabaseError', () => {
  const makePostgrestError = (message: string): PostgrestError => ({
    message,
    code: '500',
    details: '',
    hint: '',
    name: 'PostgrestError',
  });

  it('returns an Error instance', () => {
    const result = handleDatabaseError(makePostgrestError('Record not found'));
    expect(result).toBeInstanceOf(Error);
  });

  it('returns the Postgrest error message', () => {
    const result = handleDatabaseError(makePostgrestError('Record not found'));
    expect(result.message).toBe('Record not found');
  });

  it('returns a fallback message when message is empty', () => {
    const result = handleDatabaseError(makePostgrestError(''));
    expect(result.message).toBe('An unexpected database error occurred');
  });
});
