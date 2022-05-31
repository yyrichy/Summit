import { Client, Gradebook } from 'studentvue'
import { Marks } from './Gradebook'

export interface User {
  username: string
  password: string
  client: Client
  marks: Marks
  setUsername: React.Dispatch<React.SetStateAction<string>>
  setPassword: React.Dispatch<React.SetStateAction<string>>
  setClient: React.Dispatch<any>
  setMarks: React.Dispatch<any>
  setGradebook: React.Dispatch<any>
}
