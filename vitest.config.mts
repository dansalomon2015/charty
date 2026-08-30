import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^react-native$/,
        replacement: fromRoot('./node_modules/react-native-web/dist/index.js'),
      },
      {
        find: /^react-native-svg$/,
        replacement: fromRoot('./tests/react-native-svg.mock.tsx'),
      },
    ],
  },
});
