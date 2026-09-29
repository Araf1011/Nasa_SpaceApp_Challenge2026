/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'nasa-blue': '#0b3d91',
        'nasa-red': '#fc3d21',
        'cyan-bright': '#00f0ff',
        'cyan-glow': 'rgba(0, 240, 255, 0.26)',
        'gold-amber': '#ffb703',
        'gold-glow': 'rgba(255, 183, 3, 0.23)',
        'emerald-active': '#10b981',
        'mars-crimson': '#f43f5e',
        'deep': '#02040a',
        'panel-glass': 'rgba(8, 14, 32, 0.82)',
        'card-dark': 'rgba(13, 23, 50, 0.65)',
        'card-hover': 'rgba(20, 36, 76, 0.85)',
        'surface-dark': '#070c1d',
        'surface-deeper': '#090f24',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderColor: {
        glass: 'rgba(0, 240, 255, 0.14)',
        subtle: 'rgba(255, 255, 255, 0.09)',
      },
      boxShadow: {
        'cyan-glow': '0 0 10px rgba(0, 240, 255, 0.26)',
        'gold-glow': '0 0 10px rgba(255, 183, 3, 0.23)',
        'panel': '0 8px 32px rgba(0, 0, 0, 0.6)',
        'drawer': '-12px 0 60px rgba(0,0,0,0.9), 0 0 40px rgba(0,240,255,0.06) inset',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
