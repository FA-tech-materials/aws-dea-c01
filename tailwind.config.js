/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Zen Kaku Gothic New"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: { DEFAULT: '#dde6f0', 2: '#a8b6c8', 3: '#7888a0' },
        paper: { DEFAULT: '#0d1521', 2: '#131d2c', 3: '#1a2738' },
        line: { DEFAULT: '#243348', 2: '#324560' },
        aws: { DEFAULT: '#ff9900', d: '#cc7700', l: '#ffb340' },
        teal: { DEFAULT: '#1ec8b0', d: '#16a090' },
        sky: { DEFAULT: '#4a9eff', d: '#2d7fd6' },
        violet: { DEFAULT: '#a472f0', d: '#8654d0' },
        rose: { DEFAULT: '#f0608a', d: '#d64470' },
        moss: { DEFAULT: '#5fc878', d: '#42a85c' },
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease',
        'slide-up': 'slideUp 0.4s ease',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
