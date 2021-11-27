module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Source Sans Pro', 'sans-serif'],
    },
    fontSize: {
      default: '16px',
      lg: '1.3125rem',
      xl: '3rem',
    },
    fontWeight: {
      light: 300,
      semibold: 600,
    },
    extend: {
      container: {
        center: true,
      },
    },
  },
  variants: {
    extend: {
      borderColor: ['disabled'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
