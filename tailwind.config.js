/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class', // Enable dark mode via class strategy
  theme: {
    extend: {
      colors: {
        // Custom theme colors
        background: {
          DEFAULT: '#FFFFFF', // Light mode
          dark: '#0C0D10', // Dark mode
        },
        secondary: {
          DEFAULT: '#F5F5F5', // Light mode
          dark: '#121318', // Dark mode
        },
        primary: {
          DEFAULT: '#00E1A9', // Aqua/Teal (same for both)
          light: '#00E1A9',
          dark: '#00E1A9',
        },
        accent: {
          DEFAULT: '#FF8F00', // Light mode
          dark: '#FFA800', // Dark mode
        },
        text: {
          primary: {
            DEFAULT: '#1A1A1A', // Light mode
            dark: '#FFFFFF', // Dark mode
          },
          secondary: {
            DEFAULT: '#555555', // Light mode
            dark: '#A0A0A0', // Dark mode
          },
        },
      },
    },
  },
  plugins: [],
};
