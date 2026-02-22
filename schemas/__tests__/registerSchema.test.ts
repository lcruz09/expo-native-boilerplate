import { createRegisterSchema } from '../registerSchema';

// Use key pass-through so messages are the i18n keys — easy to assert
const t = (key: string) => key;
const schema = createRegisterSchema(t);

const valid = {
  email: 'user@example.com',
  password: 'Password1!',
  confirmPassword: 'Password1!',
};

describe('createRegisterSchema', () => {
  describe('email', () => {
    it('accepts a valid email', () => {
      expect(schema.safeParse(valid).success).toBe(true);
    });

    it('rejects an invalid email format', () => {
      const result = schema.safeParse({ ...valid, email: 'not-an-email' });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('validation.emailInvalid');
    });

    it('lowercases the email on parse', () => {
      const result = schema.safeParse({ ...valid, email: 'USER@EXAMPLE.COM' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('user@example.com');
      }
    });

    it('rejects an email with leading or trailing spaces', () => {
      // Zod validates .email() before applying .trim(), so padded emails fail
      const result = schema.safeParse({
        ...valid,
        email: '  user@example.com  ',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('password', () => {
    it('rejects a password shorter than 8 characters', () => {
      const result = schema.safeParse({
        ...valid,
        password: 'Aa1!',
        confirmPassword: 'Aa1!',
      });
      expect(result.success).toBe(false);
      const messages = result.error?.issues.map((i) => i.message) ?? [];
      expect(messages).toContain('validation.passwordMinLength');
    });

    it('rejects a password without an uppercase letter', () => {
      const result = schema.safeParse({
        ...valid,
        password: 'password1!',
        confirmPassword: 'password1!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects a password without a number', () => {
      const result = schema.safeParse({
        ...valid,
        password: 'Password!',
        confirmPassword: 'Password!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects a password without a special character', () => {
      const result = schema.safeParse({
        ...valid,
        password: 'Password1',
        confirmPassword: 'Password1',
      });
      expect(result.success).toBe(false);
    });

    it('accepts a password satisfying all complexity rules', () => {
      expect(schema.safeParse(valid).success).toBe(true);
    });
  });

  describe('confirmPassword', () => {
    it('rejects when passwords do not match', () => {
      const result = schema.safeParse({
        ...valid,
        confirmPassword: 'Different1!',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('validation.passwordsDoNotMatch');
    });

    it('accepts when passwords match', () => {
      expect(schema.safeParse(valid).success).toBe(true);
    });
  });

  describe('optional profile fields', () => {
    it('accepts without firstName or lastName', () => {
      expect(schema.safeParse(valid).success).toBe(true);
    });

    it('accepts empty string for firstName', () => {
      expect(schema.safeParse({ ...valid, firstName: '' }).success).toBe(true);
    });

    it('accepts empty string for lastName', () => {
      expect(schema.safeParse({ ...valid, lastName: '' }).success).toBe(true);
    });

    it('rejects firstName longer than 50 characters', () => {
      const result = schema.safeParse({ ...valid, firstName: 'a'.repeat(51) });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('validation.firstNameTooLong');
    });

    it('rejects lastName longer than 50 characters', () => {
      const result = schema.safeParse({ ...valid, lastName: 'a'.repeat(51) });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('validation.lastNameTooLong');
    });

    it('trims whitespace from firstName', () => {
      const result = schema.safeParse({ ...valid, firstName: '  John  ' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe('John');
      }
    });
  });
});
