export interface Marks {
  courses?: Map<string, Course>
}

export interface Course {
  points?: number
  categories?: Map<string, Category>
}

export interface Category {
  points?: number
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
