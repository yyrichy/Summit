import { Client } from 'studentvue'
import { Marks } from './Gradebook'

export interface User {
  client: Client
  marks: Marks
  isDarkTheme: boolean
  setClient: React.Dispatch<any>
  setMarks: React.Dispatch<any>
  setIsDarkTheme: React.Dispatch<any>
  updateTheme: (sourceColor: string) => void
}
