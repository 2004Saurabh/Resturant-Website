/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nocturne: {
          bg: '#0A0A0C',
          card: '#121215',
          cardHover: '#18181D',
          border: '#23232A',
          cream: '#F7F4EE',
          ivory: '#EFEBE2',
          wine: '#5B111D',
          wineDark: '#360910',
          wineBright: '#881A2D',
          gold: '#D4AF37',
          goldLight: '#E8C766',
          goldDark: '#A08022',
          muted: '#8E8E99',
          charcoal: '#1A1A20',
          emerald: '#10B981',
          crimson: '#EF4444'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}
