import React from 'react'
import { Gradebook } from 'studentvue'

const GradebookContext = React.createContext<Gb>(null)

export interface Gb {
  gradebook: Gradebook
  setGradebook: React.Dispatch<any>
}

export default GradebookContext
