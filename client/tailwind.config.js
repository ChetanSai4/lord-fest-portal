export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          900: '#0a0c10',
          800: '#141824',
          700: '#1e2538',
        },
        divine: {
          50: '#fcf9f2',
          100: '#f7e396',
          200: '#efcd74',
          300: '#dfb36c',
          400: '#c59a45',
          500: '#a67b2d',
        },
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        maroon: {
          600: '#9f1239',
          700: '#881337',
          800: '#4c0519',
        },
        ivory: '#fffdf9'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
