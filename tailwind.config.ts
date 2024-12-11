import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'text-left',
    'text-right',
    'text-center',
    'text-sm',
    'text-base',
    'text-2xl',
    'text-4xl',
    'text-5xl',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-crimson-pro)'],
        sans: ['var(--font-rubik)'],
      },
      colors: {
        'golden-bell': {
          '50': '#fefbe8',
          '100': '#fff7c2',
          '200': '#ffeb88',
          '300': '#ffd843',
          '400': '#ffc110',
          '500': '#efa803',
          '600': '#d58400',
          '700': '#a45a04',
          '800': '#87460c',
          '900': '#733910',
          '950': '#431c05',
        },
        chardonnay: {
          '50': '#fff8ed',
          '100': '#fff0d4',
          '200': '#ffdda9',
          '300': '#ffc677',
          '400': '#fea039',
          '500': '#fc8213',
          '600': '#ed6709',
          '700': '#c54d09',
          '800': '#9c3d10',
          '900': '#7e3410',
          '950': '#441806',
        },
      },
    },
  },
  plugins: [],
}
export default config
