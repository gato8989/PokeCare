/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pokemon-red': '#E3350D',
        'pokemon-blue': '#2A75BB',
        'pokemon-yellow': '#FFCB05',
        'pokemon-green': '#4DAD5B',
        'pokemon-light-blue': '#5DB9FF',
        'pokemon-light-red': '#FF7B7B',
        'pokemon-light-green': '#9BFF9B',
        'pokemon-light-yellow': '#FFE066',
        'pokemon-dark-blue': '#1A3A64',
        'pokemon-gray': '#58585A',
        'pokemon-light-gray': '#F2F2F2',
        'daycare-bg': '#F8FAFC',
        'card-bg': '#FFFFFF',
        'card-hover': '#F0F7FF'
      },
      fontFamily: {
        'pokemon': ['system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.1)',
        'pokemon': '0 10px 25px -5px rgba(42, 117, 187, 0.1), 0 8px 10px -6px rgba(42, 117, 187, 0.1)'
      },
      borderRadius: {
        'pokemon': '1rem',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      backgroundImage: {
        'pokemon-pattern': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSIjRThFOEU4IiBzdHJva2Utd2lkdGg9IjEiIGN4PSIyMCIgY3k9IjIwIiByPSIxMCIvPjxjaXJjbGUgZmlsbD0iI0U4RThFOCIgY3g9IjIwIiBjeT0iMjAiIHI9IjMiLz48L2c+PC9zdmc+')"      
      }
    },
  },
  plugins: [],
}