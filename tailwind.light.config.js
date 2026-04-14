/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./web/**/*.html",
    "./web/**/*.ts"
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        foreground: '#0F172A',
        primary: '#FFFFFF',
        'on-primary': '#0F172A',
        secondary: '#E2E8F0',
        accent: '#3B82F6',
        muted: '#F1F5F9',
        border: '#CBD5E1',
        destructive: '#EF4444',
        ring: '#94A3B8',
      },
      backgroundImage: {
        'body-gradient': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },
      gradientColorStops: {
        'body-from': '#FFFFFF',
        'body-via': '#F8FAFC',
        'body-to': '#F1F5F9',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 10px rgba(148, 163, 184, 0.4)',
        'glow-accent': '0 0 15px rgba(59, 130, 246, 0.4)',
        'glow-destructive': '0 0 15px rgba(239, 68, 68, 0.4)',
      }
    },
  },
  plugins: [],
}
