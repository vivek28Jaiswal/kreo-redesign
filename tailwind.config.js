/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montreal: ['"PP Neue Montreal"', 'sans-serif'],
      },
      colors: {
        'kreo-purple': '#6455F2',
        'kreo-purple-dark': '#5243DF',
        'kreo-dark': '#0F0F10',
        'kreo-nav-dark': '#111113',
        'kreo-gray': '#6B7280',
        'kreo-light': '#F8F9FA',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      }
    },
  },
  plugins: [],
}
