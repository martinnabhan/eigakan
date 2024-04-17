/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./components/**/*.tsx', './pages/**/*.page.tsx'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        lg: '3rem',
      },
    },
  },
};
