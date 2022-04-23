import React from 'react'
import { Gradebook } from 'studentvue'
import { Course } from './Course'

const GradebookContext = React.createContext<Gb>(null)

export interface Gb {
  gradebook: Gradebook
  courses: Course[]
  setGradebook: React.Dispatch<any>
  setCourses: React.Dispatch<any>
}

export default GradebookContext
