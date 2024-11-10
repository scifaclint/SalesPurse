/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a8a',
          light: '#3b82f6',
          dark: '#1e40af'
        },
        secondary: {
          DEFAULT: '#a855f7',
        }
      },
      spacing: {
        'sidebar': '250px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.1)',
      }
    }
  },
  plugins: [],
}
