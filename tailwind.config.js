/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f1fbf7',
          100: '#dcf5ea',
          200: '#b9ebd6',
          300: '#8adcbc',
          400: '#5ccaa3',
          500: '#3ab38b',
          600: '#26906f',
          700: '#1f7459',
          800: '#1d5c49',
          900: '#1b4c3e',
        },
        secondary: {
          50: '#fbf8f3',
          100: '#f5efe4',
          200: '#ebdfcb',
          300: '#dcc9a9',
          400: '#c9b08a',
          500: '#b3976d',
          600: '#967a55',
          700: '#7a6146',
          800: '#5f4c38',
          900: '#4a3b2d',
        },
        accent: {
          50: '#f5faf1',
          100: '#e8f3df',
          200: '#d2e7c2',
          300: '#b3d69a',
          400: '#94c173',
          500: '#76a755',
          600: '#5c8542',
          700: '#476734',
          800: '#3a532c',
          900: '#31462a',
        },
        success: {
          50: '#ecfdf3',
          100: '#d1fae0',
          600: '#15803d',
          700: '#166534',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          600: '#b45309',
          700: '#92400e',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          600: '#b91c1c',
          700: '#991b1b',
        },
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(27, 76, 62, 0.06), 0 8px 24px -12px rgba(27, 76, 62, 0.18)',
        lift: '0 2px 4px rgba(27, 76, 62, 0.08), 0 20px 40px -16px rgba(27, 76, 62, 0.28)',
      },
    },
  },
  plugins: [],
};
