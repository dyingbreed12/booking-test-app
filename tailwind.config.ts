import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#D4AF37'
        }
      },
      boxShadow: {
        card: '0 18px 50px rgba(31, 38, 135, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
