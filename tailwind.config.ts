import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#000000',
        'secondary': '#8a7d6b',
        'accent': '#c5a47e',
        'background': '#ffffff',
        'surface': '#f7f5f2',
        'text-primary': '#1a1a1a',
        'text-secondary': '#6b6b6b',
        'border': '#e5e0db',
      },
      fontFamily: {
        'serif': ['"Cormorant Garamond"', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
