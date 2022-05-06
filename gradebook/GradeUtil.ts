import { Gradebook } from 'studentvue'
import { Assignment, Category, Course, Marks } from '../interfaces/Gradebook'

export default class GradeUtil {
  static parseCourseName(name: string) {
    if (!name.includes('(')) return name

    return name.substring(0, name.lastIndexOf('(')).trim()
  }

  static convertGradebook(gradebook: Gradebook) {
    let marks: Marks = {
      gpa: 0,
      courses: new Map<string, Course>()
    }
    for (const course of gradebook.courses) {
      marks.courses.set(course.title, {
        period:
          gradebook.courses.findIndex((c) => c.title === course.title) + 1,
        teacher: course.staff.name,
        assignments: [],
        categories: new Map<string, Category>()
      })
      const c = marks.courses.get(course.title)
      for (const category of course.marks[0].weightedCategories) {
        c.categories.set(category.type, {
          name: category.type,
          points: 0,
          total: 0,
          weight: parseFloat(category.weight.standard)
        })
      }
      for (const assignment of course.marks[0].assignments) {
        const value = assignment.score.value
        const points = this.parsePoints(assignment.points)
        const a: Assignment = {
          name: assignment.name,
          category: assignment.type,
          status:
            value != 'Not Graded' && value != 'Not Due' ? 'Graded' : value,
          notes: assignment.notes,
          points: points[0],
          total: points[1],
          modified: false
        }
        c.assignments.push(a)
      }
    }
    marks = this.calculatePoints(marks)
    return new Promise((resolve) => {
      resolve(marks)
    })
  }

  static calculatePoints(marks: Marks) {
    marks.gpa = 0
    for (const course of marks.courses.values()) {
      ;(course.points = 0), (course.total = 0), (course.value = NaN)
      for (const category of course.categories.values()) {
        ;(category.points = 0), (category.total = 0), (category.value = NaN)
      }
      for (const assignment of course.assignments) {
        const category = course.categories.get(assignment.category)
        if (!isNaN(assignment.points) && !isNaN(assignment.total)) {
          category.points += assignment.points
          category.total += assignment.total
          category.value = category.points / category.total
        }
      }
      for (const category of course.categories.values()) {
        if (!isNaN(category.value)) {
          course.points += category.value * category.weight
          course.total += category.weight
        }
      }
      course.value = this.roundToTwo((course.points / course.total) * 100)
      if (course.value >= 89.5) {
        marks.gpa += 4
      } else if (course.value >= 79.5) {
        marks.gpa += 3
      } else if (course.value >= 69.5) {
        marks.gpa += 2
      } else if (course.value >= 59.5) {
        marks.gpa += 1
      }
    }
    marks.gpa = this.roundToTwo(marks.gpa / marks.courses.size)
    return marks
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

  static roundToTwo(n: number) {
    var multiplicator = Math.pow(10, 2)
    n = parseFloat((n * multiplicator).toFixed(11))
    var test = Math.round(n) / multiplicator
    return +test.toFixed(2)
  }
}
