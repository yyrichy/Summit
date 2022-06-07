import { Client } from 'studentvue'
import { SchoolDistrict } from 'studentvue/StudentVue/StudentVue.interfaces'
import { Marks } from './Gradebook'

export interface User {
  username: string
  password: string
  client: Client
  marks: Marks
  districts: SchoolDistrict[]
  setUsername: React.Dispatch<React.SetStateAction<string>>
  setPassword: React.Dispatch<React.SetStateAction<string>>
  setClient: React.Dispatch<any>
  setMarks: React.Dispatch<any>
}
