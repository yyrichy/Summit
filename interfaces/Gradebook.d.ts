export interface Marks {
  courses?: Map<string, Course>
  gpa?: number
}

export interface Course {
  name?: string
  period?: number
  teacher?: string
  points?: number
  total?: number
  value?: number
  assignments?: Assignment[]
  categories?: Map<string, Category>
}

export interface Category {
  name?: string
  points?: number
  total?: number
  value?: number
  weight?: number
}

export interface Assignment {
  name?: string
  category?: string
  status?: string
  notes?: string
  points?: number
  total?: number
  modified?: boolean
}
