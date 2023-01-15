export interface Marks {
  courses: Map<string, Course>
  gpa: number
  reportingPeriod: ReportingPeriod
  reportingPeriods: ReportingPeriod[]
}

export interface ReportingPeriod {
  name: string
  index: number
  date: {
    start: Date
    end: Date
  }
}

export interface Course {
  name: string
  period: number
  teacher: string
  points: number
  total: number
  value: number
  assignments: Assignment[]
  categories: Map<string, Category>
}

export interface Category {
  name: string
  points: number
  total: number
  value: number
  weight: number
  show: boolean
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
