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
        ppthin: ['ppthin', 'sans-serif'],
        pplight: ['pplight', 'sans-serif'],
        ppnormal: ['ppnormal', 'sans-serif'],
        ppregular: ['ppregular', 'sans-serif'],
        ppmedium: ['ppmedium', 'sans-serif'],
        ppbold: ['ppbold', 'sans-serif'],
        ppitalic: ['ppitalic', 'sans-serif'],
        ppsemibolditalic: ['ppsemibolditalic', 'sans-serif'],
      },
      colors: {
        'kreo-purple': '#685ACA',
        'kreo-purple-dark': '#5A4DB0',
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
