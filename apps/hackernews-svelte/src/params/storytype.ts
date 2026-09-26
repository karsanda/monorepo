import { isStoryType } from '@repo/hn-core'
import type { ParamMatcher } from '@sveltejs/kit'

export const match: ParamMatcher = (param) => isStoryType(param)
