/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./web/**/*.html",
    "./web/**/*.ts"
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        foreground: '#E0E0E0',
        primary: '#1E1E1E',
        'on-primary': '#FFFFFF',
        secondary: '#333333',
        accent: '#555555',
        muted: '#2C2C2C',
        border: '#444444',
        destructive: '#EF4444',
        ring: '#555555',
      },
      backgroundImage: {
        'body-gradient': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },
      gradientColorStops: {
        'body-from': '#121212',
        'body-via': '#1A1A1A',
        'body-to': '#050505',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 10px rgba(85, 85, 85, 0.4)',
        'glow-accent': '0 0 15px rgba(85, 85, 85, 0.4)',
        'glow-destructive': '0 0 15px rgba(239, 68, 68, 0.4)',
      }
    },
  },
  plugins: [],
}