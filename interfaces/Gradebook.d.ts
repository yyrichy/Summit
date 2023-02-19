import { ReportingPeriod } from 'studentvue/StudentVue/Client/Client.interfaces'

export interface Marks {
  courses: Map<string, Course>
  gpa: number
  reportingPeriod: ReportingPeriod
  reportingPeriods: ReportingPeriod[]
}

export interface Course {
  name: string
  period: number
  teacher: Teacher
  value?: number
  assignments: Assignment[]
  categories: Map<string, Category>
  room: string
}

export interface Teacher {
  name: string
  email: string
}

export interface Category {
  name: string
  points?: number
  total?: number
  value?: number
  weight: number
}

export interface Assignment {
  name: string
  category: string
  status: string
  notes: string
  points: number
  total: number
  modified: boolean
  date: {
    due: Date
    start: Date
  }
}
