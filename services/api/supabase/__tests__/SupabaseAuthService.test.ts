import { SupabaseAuthService } from '../SupabaseAuthService';

// jest.mock is hoisted before variable declarations, so mock functions must be
// defined inside the factory. We then retrieve them via jest.requireMock().
jest.mock('../client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      refreshSession: jest.fn(),
      getUser: jest.fn(),
      resend: jest.fn(),
      setSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}));

jest.mock('@/config', () => ({
  config: {
    supabase: { authCallbackUrl: 'expo-native-boilerplate://auth-callback' },
  },
}));

// Retrieve the mocked auth object so tests can configure return values
const mockAuth = (
  jest.requireMock('../client') as {
    supabase: { auth: Record<string, jest.Mock> };
  }
).supabase.auth;

const mockUser = { id: 'user-1', email: 'user@example.com' };
const mockSession = {
  access_token: 'access',
  refresh_token: 'refresh',
  user: mockUser,
};

describe('SupabaseAuthService', () => {
  let service: SupabaseAuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SupabaseAuthService();
  });

  // ---------------------------------------------------------------------------
  // login
  // ---------------------------------------------------------------------------
  describe('login', () => {
    it('returns user and session on success', async () => {
      mockAuth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await service.login({
        email: 'user@example.com',
        password: 'Password1!',
      });

      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
    });

    it('throws an AuthError when Supabase returns an error', async () => {
      mockAuth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials', status: 400 },
      });

      await expect(
        service.login({ email: 'user@example.com', password: 'wrong' })
      ).rejects.toMatchObject({ message: 'Invalid credentials' });
    });

    it('throws when no session is returned', async () => {
      mockAuth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      await expect(
        service.login({ email: 'user@example.com', password: 'Password1!' })
      ).rejects.toMatchObject({
        message: 'Login failed - no session returned',
      });
    });
  });

  // ---------------------------------------------------------------------------
  // register
  // ---------------------------------------------------------------------------
  describe('register', () => {
    it('returns user and session on success', async () => {
      mockAuth.signUp.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await service.register({
        email: 'user@example.com',
        password: 'Password1!',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(result.user).toEqual(mockUser);
    });

    it('throws when Supabase returns an error', async () => {
      mockAuth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email already in use', status: 422 },
      });

      await expect(
        service.register({ email: 'user@example.com', password: 'Password1!' })
      ).rejects.toMatchObject({ message: 'Email already in use' });
    });

    it('throws when no user is returned', async () => {
      mockAuth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      });

      await expect(
        service.register({ email: 'user@example.com', password: 'Password1!' })
      ).rejects.toMatchObject({
        message: 'Registration failed - no user returned',
      });
    });
  });

  // ---------------------------------------------------------------------------
  // logout
  // ---------------------------------------------------------------------------
  describe('logout', () => {
    it('resolves without error on success', async () => {
      mockAuth.signOut.mockResolvedValue({ error: null });
      await expect(service.logout()).resolves.toBeUndefined();
    });

    it('throws when Supabase returns an error', async () => {
      mockAuth.signOut.mockResolvedValue({
        error: { message: 'Sign out failed', status: 500 },
      });
      await expect(service.logout()).rejects.toMatchObject({
        message: 'Sign out failed',
      });
    });
  });

  // ---------------------------------------------------------------------------
  // getCurrentSession
  // ---------------------------------------------------------------------------
  describe('getCurrentSession', () => {
    it('returns the session when one exists', async () => {
      mockAuth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      const result = await service.getCurrentSession();
      expect(result).toEqual(mockSession);
    });

    it('returns null when there is no session', async () => {
      mockAuth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
      const result = await service.getCurrentSession();
      expect(result).toBeNull();
    });

    it('returns null when Supabase returns an error', async () => {
      mockAuth.getSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Error' },
      });
      const result = await service.getCurrentSession();
      expect(result).toBeNull();
    });

    it('returns null when an exception is thrown', async () => {
      mockAuth.getSession.mockRejectedValue(new Error('Network error'));
      const result = await service.getCurrentSession();
      expect(result).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // getCurrentUser
  // ---------------------------------------------------------------------------
  describe('getCurrentUser', () => {
    it('returns the user when one exists', async () => {
      mockAuth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      const result = await service.getCurrentUser();
      expect(result).toEqual(mockUser);
    });

    it('returns null on error', async () => {
      mockAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Error' },
      });
      const result = await service.getCurrentUser();
      expect(result).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // refreshSession
  // ---------------------------------------------------------------------------
  describe('refreshSession', () => {
    it('returns the refreshed session', async () => {
      mockAuth.refreshSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      const result = await service.refreshSession();
      expect(result).toEqual(mockSession);
    });

    it('returns null on error', async () => {
      mockAuth.refreshSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Error' },
      });
      const result = await service.refreshSession();
      expect(result).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // resendConfirmationEmail
  // ---------------------------------------------------------------------------
  describe('resendConfirmationEmail', () => {
    it('resolves without error on success', async () => {
      mockAuth.resend.mockResolvedValue({ error: null });
      await expect(service.resendConfirmationEmail('user@example.com')).resolves.toBeUndefined();
    });

    it('throws when Supabase returns an error', async () => {
      mockAuth.resend.mockResolvedValue({
        error: { message: 'Rate limit exceeded', status: 429 },
      });
      await expect(service.resendConfirmationEmail('user@example.com')).rejects.toMatchObject({
        message: 'Rate limit exceeded',
      });
    });
  });

  // ---------------------------------------------------------------------------
  // handleEmailConfirmation
  // ---------------------------------------------------------------------------
  describe('handleEmailConfirmation', () => {
    const confirmUrl =
      'expo-native-boilerplate://auth-callback#access_token=abc&refresh_token=def&type=signup';

    it('returns user and session for a valid confirmation URL', async () => {
      mockAuth.setSession.mockResolvedValue({
        data: { session: mockSession, user: mockUser },
        error: null,
      });

      const result = await service.handleEmailConfirmation(confirmUrl);

      expect(result?.user).toEqual(mockUser);
      expect(result?.session).toEqual(mockSession);
    });

    it('returns null when access_token is missing from URL', async () => {
      const result = await service.handleEmailConfirmation(
        'expo-native-boilerplate://auth-callback#refresh_token=def'
      );
      expect(result).toBeNull();
    });

    it('returns null when refresh_token is missing from URL', async () => {
      const result = await service.handleEmailConfirmation(
        'expo-native-boilerplate://auth-callback#access_token=abc'
      );
      expect(result).toBeNull();
    });

    it('returns null when setSession returns no session', async () => {
      mockAuth.setSession.mockResolvedValue({
        data: { session: null, user: null },
        error: null,
      });

      const result = await service.handleEmailConfirmation(confirmUrl);
      expect(result).toBeNull();
    });

    it('throws when setSession returns an error', async () => {
      mockAuth.setSession.mockResolvedValue({
        data: { session: null, user: null },
        error: { message: 'Invalid token', status: 401 },
      });

      await expect(service.handleEmailConfirmation(confirmUrl)).rejects.toMatchObject({
        message: 'Invalid token',
      });
    });
  });

  // ---------------------------------------------------------------------------
  // onAuthStateChange
  // ---------------------------------------------------------------------------
  describe('onAuthStateChange', () => {
    it('calls supabase.auth.onAuthStateChange and returns an unsubscribe function', () => {
      const unsubscribe = jest.fn();
      mockAuth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe } },
      });

      const callback = jest.fn();
      const result = service.onAuthStateChange(callback);

      expect(mockAuth.onAuthStateChange).toHaveBeenCalledWith(callback);
      expect(result).toBe(unsubscribe);
    });
  });
});
