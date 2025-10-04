/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00ffcc',
        'secondary': '#ff00ff',
        'background': '#0a0c10',
        'text': '#e0e0e0',
        'danger': '#ff3333',
      },
      fontFamily: {
        'mono': ['Share Tech Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
