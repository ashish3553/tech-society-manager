// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'scrollbar',
    'scrollbar-thin',
    'scrollbar-thumb-blue-600',
    'scrollbar-track-gray-200'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        invertase: {
          purple: '#7C3AED',
          'purple-light': '#8B5CF6',
          'purple-dark': '#6D28D9',
          blue: '#3B82F6',
          'blue-light': '#60A5FA',
          'blue-dark': '#2563EB',
          green: '#10B981',
          'green-light': '#34D399',
          'green-dark': '#059669',
          yellow: '#F59E0B',
          'yellow-light': '#FBBF24',
          'yellow-dark': '#D97706',
        },
        dark: {
          DEFAULT: '#0F172A',
          'card': '#1E293B',
          'lighter': '#334155',
          'lightest': '#475569',
          'border': '#334155',
          'text-primary': '#F8FAFC',
          'text-secondary': '#CBD5E1',
          'text-tertiary': '#94A3B8'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'invertase-gradient': 'linear-gradient(to right, #7C3AED, #3B82F6)',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
