/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['Neue Pixel', 'monospace'],
        'grotesk': ['PX Grotesk Pan', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
