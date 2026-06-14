/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        fifa: {
          blue: '#0a1628',
          'blue-mid': '#1a2e4a',
          'blue-light': '#1e3a5f',
          gold: '#c9a84c',
          'gold-bright': '#f0c040',
          'gold-muted': '#8b6914',
          silver: '#e8e8e8',
          red: '#e63946',
          green: '#2ec27e',
          grey: '#6b7280',
        }
      },
      fontFamily: {
        display: ['"Georgia"', 'Cambria', '"Times New Roman"', 'serif'],
        body: ['"Trebuchet MS"', '"Lucida Sans Unicode"', 'Arial', 'sans-serif'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
      backgroundImage: {
        'fifa-gradient': 'linear-gradient(135deg, #0a1628 0%, #1a2e4a 50%, #0f2040 100%)',
        'card-gradient': 'linear-gradient(145deg, #1a2e4a, #0f1e35)',
      }
    }
  },
  plugins: []
}
