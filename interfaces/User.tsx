import { Client } from 'studentvue'
import { Marks } from './Gradebook'

export interface User {
  client: Client
  marks: Marks
  setClient: React.Dispatch<any>
  setMarks: React.Dispatch<any>
}
