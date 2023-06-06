/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    colors: {
      'custom-red': '#F4533E',
      'custom-white': '#F5F6F3',
      'custom-green': '#74AC5D',
      'custom-dark': '#080B06',
      'custom-grey': '#4D594A',
      'custom-blue': '#2EB9DC',
    },
    extend: {
      spacing: {
        10.5: '2.625rem',
      },
    },
  },
  plugins: [],
}

