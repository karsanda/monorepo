// jest-dom's matchers registered on this runner's own `expect`. Its `/vitest` entry would import
// Vitest from jest-dom's location, which pnpm can resolve to a second copy that breaks `rejects`.
import type {} from '@testing-library/jest-dom/vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'

expect.extend(matchers)
afterEach(cleanup)
