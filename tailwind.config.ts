import type { Config } from "tailwindcss";

import colors from 'tailwindcss/colors';
const constants = {
  white: '#FBFBFB',
  black: '#0F0F0F',
  red: '#A90909',
}


const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: colors.transparent,
      ...constants
    },
    extend: {
      screens: {
        'lap': { 'max': '991px' },
        'mob': { 'max': '767px' },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require('tailwind-hamburgers')],
};
export default config;
