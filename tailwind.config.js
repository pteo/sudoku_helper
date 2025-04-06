/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#2a4365',
        secondary: '#4a5568',
        accent: '#63b3ed',
      },
    },
  },
  plugins: [],
}
