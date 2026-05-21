import type { Config } from 'tailwindcss';

/** Legacy config; Tailwind v4 uses @source in globals.css. Kept for tooling/IDE hints. */
const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
};

export default config;


