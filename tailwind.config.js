module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ['Source Sans Pro', 'sans-serif'],
    },
    fontSize: {
      'base': ['1rem', { lineHeight: '1.5rem' }],
      'lg': ['1.3125rem', { lineHeight: '1.75rem' }],
      'xl': ['1.5rem', { lineHeight: '2rem' }],
      '2xl': ['3rem', { lineHeight: '1' }],
    },
    fontWeight: {
      light: 300,
      regular: 400,
      semibold: 600,
    },
    colors: {
      transparent: 'transparent',
      black: '#000000',
      white: '#FFFFFF',
      gray: {
        100: '#F8F8F8',
        200: '#979797',
      },
      red: '#A22D27',
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
