/**
 * English translations (Boilerplate Version)
 */

export const en = {
  // Common
  common: {
    cancel: "Cancel",
    confirm: "Confirm",
    ok: "OK",
    retry: "Retry",
    back: "Back",
    next: "Next",
    done: "Done",
    close: "Close",
    save: "Save",
    delete: "Delete",
    remove: "Remove",
    edit: "Edit",
    settings: "Settings",
    loading: "Loading...",
    comingSoon: "Coming soon",
    error: "Error",
    status: "Status",
    actions: "Actions",
    welcome: "Welcome",
  },

  // Navigation
  navigation: {
    home: "Home",
    settings: "Settings",
    profile: "Profile",
    about: "About",
  },

  // Settings
  settings: {
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    selectTheme: "Select Theme",
    language: "Language",
    selectLanguage: "Select Language",
    developer: "Developer",
    manageLogs: "Manage Logs",
    enableMockDevices: "Enable Mock Data",
  },

  // About
  about: {
    title: "About",
    version: "Version",
    description:
      "This is a generic Expo React Native boilerplate with Auth, Theme, and i18n support.",
    madeWith: "Made with ❤️",
    viewAbout: "View About",
  },

  // Errors
  errors: {
    unexpectedError: "An unexpected error occurred",
    tryAgain: "Please try again",
    loadFailed: "Failed to load data",
    updateFailed: "Failed to update",
    generic: "Something went wrong",
    boundary: {
      title: "Something went wrong",
      description: "We ran into an issue. Go back home and try again.",
      cta: "Go to Home",
    },
  },

  // Notifications
  notifications: {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Info",
    changesSaved: "Changes saved successfully",
    somethingWentWrong: "Something went wrong",
  },

  // Profile
  profile: {
    title: "Profile",
    age: "Age",
    ageUnit: "years",
    birthYear: "Birth Year",
    weight: "Weight",
    weightUnit: "kg",
    height: "Height",
    heightUnit: "cm",
    gender: "Gender",
    selectGender: "Select Gender",
    genderMale: "Male",
    genderFemale: "Female",
    genderOther: "Other",
    update: "Update Profile",
    updated: "Profile updated successfully",
  },

  // Authentication
  auth: {
    login: "Login",
    signIn: "Sign In",
    signingIn: "Signing in...",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    dontHaveAccount: "Don't have an account?",
    createAccount: "Create Account",
    register: "Register",
    creatingAccount: "Creating Account...",
    confirmPassword: "Confirm Password",
    alreadyHaveAccount: "Already have an account?",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email address",
    passwordRequired: "Password is required",
    accountInformation: "Account Information",
    personalInformation: "Personal Information",
    registrationSuccess: "Account Created Successfully!",
    loginSuccess: "Welcome back!",
    loginDescription: "Sign in to continue",
    loginFailed: "Login failed. Please try again.",
    registrationFailed: "Registration failed. Please try again.",
    emailAlreadyRegistered: "This email is already registered.",
    invalidCredentials: "Invalid email or password",
    confirmationRequired: "Please check your email to confirm your account.",
    verifyingEmail: "Verifying Email",
    pleaseWait: "Please wait...",
    logout: "Logout",
    loggingOut: "Logging out...",
  },

  // Form Validation
  validation: {
    required: "This field is required",
    emailInvalid: "Please enter a valid email address",
    passwordMinLength: "Password must be at least 8 characters long",
    passwordsDoNotMatch: "Passwords do not match",
    birthYearRequired: "Birth year is required",
    weightRequired: "Weight is required",
    heightRequired: "Height is required",
    genderRequired: "Gender is required",
  },
};

export type Translations = typeof en;
