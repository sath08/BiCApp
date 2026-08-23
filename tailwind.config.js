/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand blue, derived from the Best in Class logo. Every shade from
        // 600 up is >= 4.5:1 against white (600 = 8.4:1) so it's safe for
        // body text; 500-900 are all safe as a background under white text.
        purple: {
          50: '#EFF5FC',
          100: '#DCEAF7',
          200: '#B9D5EF',
          300: '#8DB9E3',
          400: '#5A93CE',
          500: '#2E6DB4',
          600: '#1D4E89',
          700: '#163D6D',
          800: '#102C50',
          900: '#0B1E38',
          950: '#071527',
        },
        // Brand green, derived from the logo's open-book / banner green.
        // 600 up is >= 4.5:1 against white; use 600+ (not 500) as a
        // background under white text.
        teal: {
          50: '#EFF8F1',
          100: '#DCEFE0',
          200: '#B7DFC1',
          300: '#8CC99C',
          400: '#57AD6C',
          500: '#2F9E52',
          600: '#1B6B34',
          700: '#155429',
          800: '#0F3D1E',
          900: '#0A2814',
          950: '#06190C',
        },
        primary: {
          DEFAULT: '#1D4E89',
          light: '#2E6DB4',
          dark: '#163D6D',
        },
        secondary: {
          DEFAULT: '#1B6B34',
          light: '#2F9E52',
          dark: '#155429',
        },
        accent: {
          teal: '#1B6B34',
          yellow: '#854D0E',
        },
        bg: {
          lavender: '#F3F8FC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
