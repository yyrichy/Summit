import { Assignment } from './Assignment'

export interface Category {
  points: number
  total: number
  weight: number
  assignments: Assignment[]
}
