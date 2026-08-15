/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zen: {
          bg: '#0A0C0E',
          card: '#12161A',
          cardBorder: '#1F262E',
          paper: '#F5F2EB',
          muted: '#8A95A0',
          gold: '#E5A93C',
          goldGlow: '#F5BE58',
          moss: '#3B4B44',
          mossLight: '#5E756B',
          vermilion: '#C84B31',
          slate: '#1E252B',
          ink: '#060809'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Noto Serif', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'zen-radial': 'radial-gradient(circle at 50% 0%, rgba(229, 169, 60, 0.08) 0%, rgba(10, 12, 14, 0.98) 70%)',
        'zen-card-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #E5A93C 0%, #F5BE58 100%)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
