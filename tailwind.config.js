module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Source Sans Pro', 'sans-serif'],
    },
    fontSize: {
      'default': '16px',
      'lg': '1.3125rem',
      'xl': '1.5rem',
      '2xl': '3rem',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      semibold: 600,
    },
    colors: {
      transparent: 'transparent',
      black: 'rgb(0, 0, 0)',
      white: 'rgb(255, 255, 255)',
      gray: {
        100: '#F8F8F8',
      },
      red: 'rgb(162, 45, 39)',
    },
    extend: {
      container: {
        center: true,
      },
    },
  },
  variants: {
    extend: {
      borderOpacity: ['disabled'],
      textOpacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
