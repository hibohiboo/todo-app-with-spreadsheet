import type { ID } from './common'
import type { OptionalKeys } from './utils'
export interface DataStorage<T extends { rowNumber: number }> {
  fetchAll: () => Promise<T[]>
  fetchByCompleted: (completed: boolean) => Promise<T[]>
  create: (todo: Omit<T, 'rowNumber'>) => Promise<void>
  update: (rowNumber: number, update: OptionalKeys<T>) => Promise<T | null>
  remove: (rowNumber: number) => Promise<number | null>
}
