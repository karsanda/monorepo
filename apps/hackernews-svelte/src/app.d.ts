import type { Theme } from '@repo/hn-core'

// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
  namespace App {
    interface Locals {
      /** From the theme cookie; undefined means "follow the OS". */
      theme?: Theme
    }
  }
}

export {}
