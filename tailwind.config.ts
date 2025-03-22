import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0077FF',
        'primary-light': '#E6F2FF',
        'dark-text': '#111827',
        'gray-text': '#6B7280',
        'light-gray': '#F3F4F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'navbar': '0 1px 3px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}

export default config