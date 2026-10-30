import { defineConfig } from 'steiger';
import fsdPlugin from '@feature-sliced/steiger-plugin';

export default defineConfig({
  plugins: [fsdPlugin],
  rules: {
    'insignificant-slice': 'off',
  },
});