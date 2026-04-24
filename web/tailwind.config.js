/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0A0A0A',
          50: '#F5F5F0',
          100: '#E8E8E0',
          200: '#C8C8B8',
          300: '#A8A890',
          400: '#787860',
          500: '#484830',
          600: '#303020',
          700: '#1E1E14',
          800: '#141410',
          900: '#0A0A0A',
        },
        amber: {
          DEFAULT: '#D4A843',
          light: '#E8C46A',
          dark: '#A07820',
        },
        cream: '#F8F4EC',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'scale-in': 'scaleIn 0.3s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
