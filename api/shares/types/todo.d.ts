import type { ID } from './common'
export interface Todo {
  rowNumber: number
  id: ID
  title: string
  completed: boolean
}
