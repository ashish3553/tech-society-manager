import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // resolve: {
  //   alias: {
  //     'codemirror/lib/codemirror.css': path.resolve(__dirname, 'node_modules/codemirror/lib/codemirror.css'),
  //     'codemirror/theme/material.css': path.resolve(__dirname, 'node_modules/codemirror/theme/material.css')
  //   }
  // }
})
