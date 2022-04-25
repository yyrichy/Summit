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
    let marks: Marks = {
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
      for (const [categoryName, category] of marks.courses
        .get(course.title)
        .categories.entries()) {
        for (const weightedCategory of course.marks[0].weightedCategories) {
          if (weightedCategory.type === categoryName) {
            category.weight = parseFloat(weightedCategory.weight.standard)
            break
          }
        }
        marks.courses.get(course.title).categories.set(categoryName, category)
      }
    }
    marks = this.calculatePoints(marks)
    return new Promise((resolve) => {
      resolve(marks)
    })
  }

  static calculatePoints(marks: Marks) {
    console.log('calculate')
    for (const [courseName, course] of marks.courses.entries()) {
      for (const [categoryName, category] of course.categories.entries()) {
        let points: number = 0,
          total: number = 0
        for (const assignment of category.assignments.values()) {
          if (!isNaN(assignment.points)) {
            points += assignment.points
          }
          total += assignment.total
        }
        category.points = points
        category.total = total
        course.categories.set(categoryName, category)
      }
      let points: number = 0,
        totalWeight: number = 0
      for (const category of course.categories.values()) {
        const categoryPoints =
          (category.points / category.total) * category.weight
        if (!isNaN(category.points)) {
          points += categoryPoints
          totalWeight += category.weight
        }
      }
      console.log(points + ' ' + totalWeight)
      points = points / totalWeight
      course.points = points
      marks.courses.set(courseName, course)
    }
    return marks
  }
}
