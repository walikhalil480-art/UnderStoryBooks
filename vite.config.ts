import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { folioApiPlugin } from './server/apiPlugin';

export default defineConfig({
  plugins: [react(), folioApiPlugin()]
});
