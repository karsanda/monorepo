import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

// The app's Vite config (Qwik optimizer + Qwik City's route plan), plus the test settings.
export default defineConfig((env) =>
  mergeConfig(viteConfig(env), {
    // Qwik's createDOM() brings its own DOM, so tests run in plain Node.
    test: { environment: 'node', restoreMocks: true },
  }),
)
