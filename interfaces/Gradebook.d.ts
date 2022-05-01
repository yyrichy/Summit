export interface Marks {
  courses?: Map<string, Course>
}

export interface Course {
  period?: number
  teacher?: string
  points?: number
  categories?: Map<string, Category>
}

export interface Category {
  points?: number
  total?: number
  weight?: number
  assignments?: Map<string, Assignment>
}

export interface Assignment {
  name?: string
  status?: string
  notes?: string
  points?: number
  total?: number
  modified?: boolean
}
