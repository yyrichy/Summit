import { Gradebook } from 'studentvue'
import { Marks, Assignment, Category } from '../interfaces/Gradebook'

export default class Grades {
  marks: Marks
  constructor(marks: Marks) {
    this.marks = marks
  }

  static parsePoints(points: string) {
    const regex = /^(\d+\.?\d*|\.\d+) \/ (\d+\.?\d*|\.\d+)$/
    if (points.match(regex)) {
      const p = points.split(regex)
      return [parseFloat(p[1]), parseFloat(p[2])]
    } else {
      return [NaN, parseFloat(points)]
    }
  }

  static convertGradebook(gradebook: Gradebook) {
    const marks: Marks = {
      courses: new Map<string, Category>()
    }
    for (const course of gradebook.courses) {
      marks.courses.set(course.title, {
        categories: new Map<string, Category>()
      })
      for (const assignment of course.marks[0].assignments) {
        if (!marks.courses.get(course.title).categories.has(assignment.type)) {
          marks.courses.get(course.title).categories.set(assignment.type, {
            assignments: new Map<string, Assignment>()
          })
        }
        const value = assignment.score.value
        const points = this.parsePoints(assignment.points)
        const a: Assignment = {
          name: assignment.name,
          status:
            value != 'Not Graded' && value != 'Not Due' ? 'Graded' : value,
          notes: assignment.notes,
          points: points[0],
          total: points[1],
          modified: false
        }
        marks.courses
          .get(course.title)
          .categories.get(assignment.type)
          .assignments.set(a.name, a)
      }
    }
    return new Promise((resolve) => {
      resolve(marks)
    })
  }
}
