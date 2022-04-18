import { Client, Gradebook } from "studentvue"

export interface User {
  username: string
  password: string
  client: Client
  gradebook: Gradebook
  setUsername: React.Dispatch<React.SetStateAction<string>>
  setPassword: React.Dispatch<React.SetStateAction<string>>
  setClient: React.Dispatch<any>
  setGradebook: React.Dispatch<any>
}
