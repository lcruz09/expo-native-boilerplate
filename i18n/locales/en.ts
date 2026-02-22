/**
 * English translations (Boilerplate Version)
 */

export const en = {
  // Common
  common: {
    retry: 'Retry',
    error: 'Error',
    loading: 'Loading...',
    welcome: 'Welcome',
    tryAgain: 'Try Again',
  },

  // Layout & Navigation
  layout: {
    welcome: 'Welcome',
    login: 'Login',
    home: 'Home',
  },

  // Auth & Landing
  auth: {
    login: {
      title: 'Welcome Back',
      subtitle: 'Enter your credentials to continue',
      emailLabel: 'Email Address',
      emailPlaceholder: 'email@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      submitButton: 'Log In',
      noAccount: "Don't have an account?",
      contactSupport: 'Contact Support',
      errors: {
        invalidEmail: 'Invalid email address',
        passwordLength: 'Password must be at least 8 characters',
        passwordUppercase: 'Password must contain at least one uppercase letter',
        passwordLowercase: 'Password must contain at least one lowercase letter',
        passwordNumber: 'Password must contain at least one number',
      },
    },
    landing: {
      tagline: 'Your ultimate native foundation',
      loginButton: 'Log In',
    },
  },

  // Pages
  home: {
    subtitle:
      'This is your clean Expo Native Boilerplate. Use the components below as a guide for your development.',
    elementExamples: 'Element Examples:',
    buttonAtom: 'Button (Atom):',
    action: 'Action',
    themeStore: 'Theme (Store):',
    switchLight: 'Switch to Light',
    switchDark: 'Switch to Dark',
    docsGuide: 'Check the docs/DEVELOPMENT.md for more information.',
  },

  notFound: {
    title: 'Oops! Not Found',
    goHome: 'Go back to Home screen!',
  },

  // Components
  errorBoundary: {
    title: 'Oops! Something went wrong.',
    message: "We've logged the error and our team is looking into it.",
    retryText: 'Try Again',
  },

  about: {
    version: 'Version',
  },

  settings: {
    title: 'Settings',
    appearance: {
      title: 'Appearance',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
    language: {
      title: 'Language',
      en: 'English',
      es: 'Español',
    },
    account: {
      title: 'Account',
      logout: 'Log Out',
    },
  },
};

export type Translations = typeof en;
