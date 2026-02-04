/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2B5797',
        secondary: '#E8F4FD',
        accent: '#10B981',
        warning: '#F59E0B',
      }
    }
  },
  plugins: []
}
