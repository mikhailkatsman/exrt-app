/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
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
      'custom-dark': '#121212',
      'custom-grey': '#606060',
      'custom-blue': '#5AABD6',
    },
    extend: {
      fontFamily: {
        'BaiJamjuree-Light': ['BaiJamjuree-Light'],
        'BaiJamjuree-Regular': ['BaiJamjuree-Regular'],
        'BaiJamjuree-Medium': ['BaiJamjuree-Medium'],
        'BaiJamjuree-Bold': ['BaiJamjuree-Bold'],
        'BaiJamjuree-LightItalic': ['BaiJamjuree-LightItalic'], 
        'BaiJamjuree-RegularItalic': ['BaiJamjuree-Italic'], 
        'BaiJamjuree-MediumItalic': ['BaiJamjuree-MediumItalic'], 
        'BaiJamjuree-BoldItalic': ['BaiJamjuree-BoldItalic'],
      },
      spacing: {
        10.5: '2.625rem',
        30: '7.5rem',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /(bg|text|border)-custom-(red|white|green|dark|grey|blue)/
    },
    {
      pattern: /(mt|mb|mr|ml|my|mx|px|py|pt|pb|pl|pr)-[0-9]+/
    },
    {
      pattern: /flex-.*/
    },
    {
      pattern: /(bottom|right|top|left)-[0-9]+/
    },
    {
      pattern: /(w|h)-[0-9]+/
    }
  ]
}

