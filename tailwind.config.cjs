/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderWidth: {
        12: '12px'
      },
      margin: {
        112: '28rem',
        116: '29rem',
        120: '30rem',
        124: '31rem',
        128: '32rem',
        131: '32rem',
        132: '33rem',
        136: '34rem',
        140: '35rem',
        144: '36rem'
      }
    }
  },
  plugins: []
}

module.exports = config
