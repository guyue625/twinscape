export interface LoadGuard {
  begin(): number
  invalidate(): void
  isCurrent(token: number): boolean
}

export function createLoadGuard(): LoadGuard {
  let generation = 0
  return {
    begin: () => ++generation,
    invalidate: () => { generation += 1 },
    isCurrent: (token) => token === generation,
  }
}
