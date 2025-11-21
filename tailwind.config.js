/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['Press Start 2P', 'Neue Pixel', 'Courier New', 'monospace'],
        'grotesk': ['PX Grotesk Pan', 'sans-serif'],
        'retro': ['Press Start 2P', 'Neue Pixel', 'Courier New', 'monospace'],
      },
      colors: {
        'retro': {
          'bg': '#000000',
          'fg': '#ffffff',
          'border': '#ffffff',
          'hover': '#888888',
        },
      },
    },
  },
  plugins: [],
};
