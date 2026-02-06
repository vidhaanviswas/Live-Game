/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'flip-in': 'flipIn 0.35s ease-out',
        'flip-back': 'flipBack 0.35s ease-out',
        'pop-in': 'popIn 0.3s ease-out',
        'score-bump': 'scoreBump 0.4s ease-out',
      },
      keyframes: {
        flipIn: {
          '0%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        flipBack: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(90deg)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scoreBump: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
};
