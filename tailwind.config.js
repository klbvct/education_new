/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#266AF6',
        dark: '#2F2222',
        muted: 'rgba(47, 34, 34, 0.4)',
        secondary: '#7D8DFF',
        'bg-base': '#f9f9f9',
        'bg-secondary': '#f1f2f8',
      },
      fontFamily: {
        sans: ['"Futura PT"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
