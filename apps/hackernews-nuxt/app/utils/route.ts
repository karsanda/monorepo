import type { LocationQueryValue } from 'vue-router'

/** A query value as a string, ignoring repeated keys. */
export const queryString = (value: LocationQueryValue | LocationQueryValue[] | undefined) =>
  typeof value === 'string' ? value : undefined
