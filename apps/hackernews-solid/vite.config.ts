import { solidStart } from '@solidjs/start/config'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

// Nitro builds the server: `node-server` locally, the Vercel preset when built on Vercel.
export default defineConfig({
  plugins: [solidStart(), nitro()],
})
