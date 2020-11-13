export * from './lodash'
export * from './ipc'
export * from './number'
export * from './timer'
export * from './address'
export * from './string'
export * from './date'
export * from './url'


export const makeConstants = (a: string[]): Record<string, string> => a.reduce((m, v) => {
  m[v] = v
  return m
}, {} as Record<string, string>)


