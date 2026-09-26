import { isStoryType, type StoryType } from '@repo/hn-core'
import type { ParamMatcher } from '@sveltejs/kit'

// A type guard, so `params.slug` is typed as `StoryType` in the route.
export const match = ((param: string): param is StoryType =>
  isStoryType(param)) satisfies ParamMatcher
