/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderWidth: {
        12: '12px'
      }
    }
  },
  plugins: []
}

module.exports = config
