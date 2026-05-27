/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A1A',
        panel: '#13132A',
        primary: '#7C3AED',
        accent: '#22D3EE',
        cta: '#22C55E',
        warning: '#F59E0B',
        gold: '#F59E0B',
        danger: '#EF4444',
        text: '#F8FAFC',
        muted: '#94A3B8',
        common: '#94A3B8',
        rare: '#22D3EE',
        epic: '#A855F7',
        legendary: '#F59E0B',
      },
      fontFamily: {
        display: ['System'],
      },
    },
  },
  plugins: [],
};
