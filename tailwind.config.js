/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./web/**/*.html",
    "./web/**/*.ts"
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F0F23',
        foreground: '#F8FAFC',
        primary: '#1E1B4B',
        'on-primary': '#FFFFFF',
        secondary: '#4338CA',
        accent: '#22C55E',
        muted: '#27273B',
        border: '#312E81',
        destructive: '#EF4444',
        ring: '#1E1B4B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 10px rgba(67, 56, 202, 0.4)',
        'glow-accent': '0 0 15px rgba(34, 197, 94, 0.4)',
        'glow-destructive': '0 0 15px rgba(239, 68, 68, 0.4)',
      }
    },
  },
  plugins: [],
}