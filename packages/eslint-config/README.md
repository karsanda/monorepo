# `@repo/eslint-config`

Shared ESLint flat configs.

| Export                       | For                                                      |
| ---------------------------- | -------------------------------------------------------- |
| `@repo/eslint-config/base`   | Plain TypeScript packages                                |
| `@repo/eslint-config/next`   | Next.js apps (React hooks + `@next/eslint-plugin-next`)  |
| `@repo/eslint-config/vue`    | Vue SFCs                                                 |
| `@repo/eslint-config/svelte` | Svelte / SvelteKit (a function taking the Svelte config) |
| `@repo/eslint-config/solid`  | SolidStart apps (`eslint-plugin-solid`)                  |
| `@repo/eslint-config/qwik`   | Qwik City apps (`eslint-plugin-qwik`, type-aware)        |

```js
// eslint.config.js
import next from '@repo/eslint-config/next'
export default next
```
