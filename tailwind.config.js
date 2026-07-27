/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'steampunk': {
          'brown': '#642D0E',
          'brown-dark': '#3d1a07',
          'brown-light': '#8b4513',
          'orange': '#FB8F4E',
          'apricot': '#F9CCA2',
          'cream': '#fef3e2',
          'olive': '#6D7E34',
          'olive-light': '#8fa346',
          'sage': '#7E7C7D',
          'parchment': '#f5e6c8',
          'brass': '#c9a227',
        }
      },
      fontFamily: {
        'hand': ['"Comic Sans MS"', '"Segoe Print"', '"Bradley Hand"', 'cursive'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'sway': 'sway 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #FB8F4E, 0 0 10px #FB8F4E' },
          '100%': { boxShadow: '0 0 20px #FB8F4E, 0 0 30px #c9a227' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
