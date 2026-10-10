/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        hype: {
          black: '#0a0a0a',
          charcoal: '#1a1a1a',
          dark: '#111111',
          accent: '#dc2626', // Strong gym red
          accentHover: '#b91c1c',
        },
      },
      fontFamily: {
        heading: ['"Bebas Neue"', '"Oswald"', 'sans-serif'],
        body: ['"Inter"', '"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
