import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from '@tanstack/react-start/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    preset: 'aws-lambda',
  },
  vite: {
    plugins: [
      // biome-ignore lint/suspicious/noExplicitAny: Remove when https://github.com/tailwindlabs/tailwindcss/issues/16488 is fixed.
      tailwindcss() as unknown as any,
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
});
