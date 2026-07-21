/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070b12',
          900: '#0b1118',
          850: '#0e1620',
          800: '#121c28',
          700: '#1a2735',
          600: '#243345',
          500: '#33455c',
        },
        hazard: {
          critical: '#ff3b3b',
          high: '#ff7a1a',
          medium: '#ffc24b',
          low: '#3fd0a0',
          info: '#3aa0ff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(58,160,255,0.35)',
        'glow-red': '0 0 28px rgba(255,59,59,0.45)',
        'glow-amber': '0 0 24px rgba(255,122,26,0.4)',
        'glow-green': '0 0 20px rgba(63,208,160,0.35)',
        card: '0 8px 30px rgba(0,0,0,0.45)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        gridmove: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 2s ease-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        floaty: 'floaty 4s ease-in-out infinite',
        gridmove: 'gridmove 8s linear infinite',
      },
    },
  },
  plugins: [],
};
