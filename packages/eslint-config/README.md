# `@repo/eslint-config`

Shared ESLint flat configs.

| Export                       | For                                                     |
| ---------------------------- | ------------------------------------------------------- |
| `@repo/eslint-config/base`   | Plain TypeScript packages                               |
| `@repo/eslint-config/react`  | React apps (hooks + react-refresh)                      |
| `@repo/eslint-config/vue`    | Vue SFCs                                                |
| `@repo/eslint-config/svelte` | Svelte / SvelteKit (a function taking the Svelte config) |

```js
// eslint.config.js
import react from '@repo/eslint-config/react'
export default react
```
