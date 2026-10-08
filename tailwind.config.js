/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8eb',
          100: '#ffecc2',
          200: '#ffd685',
          300: '#ffbc47',
          400: '#ffa41f',
          500: '#f98307',
          600: '#dd6203',
          700: '#b74407',
          800: '#94350c',
          900: '#7a2d0e',
        },
      },
    },
  },
  plugins: [],
};
