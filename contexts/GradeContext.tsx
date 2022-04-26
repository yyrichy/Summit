import React from 'react'

interface CourseName {
  courseHeader: string
  setCourse: React.Dispatch<React.SetStateAction<string>>
}

const GradeContext = React.createContext<CourseName>(null)

export default GradeContext
