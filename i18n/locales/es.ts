/**
 * Spanish translations
 */

export const es = {
  // Common
  common: {
    retry: 'Reintentar',
    error: 'Error',
    loading: 'Cargando...',
    welcome: 'Bienvenido',
    tryAgain: 'Intentar de nuevo',
  },

  // Layout & Navigation
  layout: {
    welcome: 'Bienvenido',
    login: 'Iniciar sesión',
    home: 'Inicio',
  },

  // Auth & Landing
  auth: {
    login: {
      title: 'Bienvenido de nuevo',
      subtitle: 'Ingresa tus credenciales para continuar',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'correo@ejemplo.com',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: '••••••••',
      submitButton: 'Iniciar sesión',
      noAccount: '¿No tienes una cuenta?',
      contactSupport: 'Contactar soporte',
      errors: {
        invalidEmail: 'Correo electrónico inválido',
        passwordLength: 'La contraseña debe tener al menos 8 caracteres',
        passwordUppercase: 'La contraseña debe contener al menos una letra mayúscula',
        passwordLowercase: 'La contraseña debe contener al menos una letra minúscula',
        passwordNumber: 'La contraseña debe contener al menos un número',
      },
    },
    landing: {
      tagline: 'Tu base nativa definitiva',
      loginButton: 'Iniciar sesión',
    },
  },

  // Pages
  home: {
    subtitle:
      'Este es tu Expo Native Boilerplate. Usa los componentes a continuación como guía para tu desarrollo.',
    elementExamples: 'Ejemplos de elementos:',
    buttonAtom: 'Botón (Atom):',
    action: 'Acción',
    themeStore: 'Tema (Store):',
    switchLight: 'Cambiar a claro',
    switchDark: 'Cambiar a oscuro',
    docsGuide: 'Consulta docs/DEVELOPMENT.md para más información.',
  },

  notFound: {
    title: '¡Ups! No encontrado',
    goHome: '¡Volver a la pantalla de inicio!',
  },

  // Components
  errorBoundary: {
    title: '¡Ups! Algo salió mal.',
    message: 'Hemos registrado el error y nuestro equipo lo está revisando.',
    retryText: 'Intentar de nuevo',
  },

  about: {
    version: 'Versión',
  },

  settings: {
    title: 'Configuración',
    appearance: {
      title: 'Apariencia',
      light: 'Claro',
      dark: 'Oscuro',
      system: 'Sistema',
    },
    language: {
      title: 'Idioma',
      en: 'English',
      es: 'Español',
    },
    account: {
      title: 'Cuenta',
      logout: 'Cerrar sesión',
    },
  },
};
