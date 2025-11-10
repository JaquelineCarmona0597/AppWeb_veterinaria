/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffa726',
        'primary-dark': '#fb8c00',
        'primary-soft': '#fff3e0'
      }
    },
  },
  plugins: [],
}
