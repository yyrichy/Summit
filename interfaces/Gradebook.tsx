import React from 'react'
import { Assignment, Gradebook } from 'studentvue'

const GradebookContext = React.createContext<Gb>(null)

export interface Gb {
  gradebook: Gradebook
  setGradebook: React.Dispatch<any>
}

export default GradebookContext
