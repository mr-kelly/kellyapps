/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './lib/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'ui-sans-serif', 'sans-serif']
      },
      colors: {
        surface: '#0d0f12',
        card: '#161a1e',
        accent: '#3d82f6',
        accentMuted: '#1f2937',
        positive: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444'
      },
      boxShadow: {
        card: '0 2px 4px -1px rgba(0,0,0,0.4), 0 4px 12px -2px rgba(0,0,0,0.3)'
      }
    }
  },
  plugins: []
};
