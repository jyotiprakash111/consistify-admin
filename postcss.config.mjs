import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** Pin Tailwind to this app directory (avoids resolving from parent workspace folders). */
const config = {
  plugins: {
    '@tailwindcss/postcss': {
      base: projectRoot,
    },
  },
};

export default config;
