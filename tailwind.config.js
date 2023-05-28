/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'custom-orange': '#BA2D0B',
      'custom-white': '#D5F2E3',
      'custom-light-green': '#73BA9B',
      'custom-green': '#003E1F',
      'custom-dark': '#01110A',
    },
    extend: {
    },
  },
  plugins: [],
}

