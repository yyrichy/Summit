import { Gradebook } from 'studentvue'
import { Colors } from '../colors/Colors'
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
        name: course.title,
        period:
          gradebook.courses.findIndex((c) => c.title === course.title) + 1,
        teacher: course.staff.name,
        points: 0,
        total: 0,
        value: NaN,
        assignments: [],
        categories: new Map<string, Category>()
      })
      const c = marks.courses.get(course.title)
      for (const category of course.marks[0].weightedCategories) {
        c.categories.set(category.type, {
          name: category.type,
          points: 0,
          total: 0,
          value: NaN,
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
          modified: false,
          date: {
            due: assignment.date.due,
            start: assignment.date.start
          }
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
    let numOfCourses = 0
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
      if (!isNaN(course.value)) {
        if (course.value >= 89.5) {
          marks.gpa += 4
        } else if (course.value >= 79.5) {
          marks.gpa += 3
        } else if (course.value >= 69.5) {
          marks.gpa += 2
        } else if (course.value >= 59.5) {
          marks.gpa += 1
        }
        numOfCourses++
      }
    }
    marks.gpa = this.roundToTwo(marks.gpa / numOfCourses)
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

  static roundToTwo(num: number) {
    const multiplicator = Math.pow(10, 2)
    num = parseFloat((num * multiplicator).toFixed(11))
    const test = Math.round(num) / multiplicator
    return +test.toFixed(2)
  }

  static deleteAssignment(marks: Marks, course: string, assignment: string) {
    const newMarks = Object.assign({}, marks)
    newMarks.courses.get(course).assignments = newMarks.courses
      .get(course)
      .assignments.filter((a) => a.name !== assignment)
    return GradeUtil.calculatePoints(newMarks)
  }

  static updatePoints(
    marks: Marks,
    course: string,
    assignmentName: string,
    input: string,
    type: string
  ) {
    const points = parseFloat(input)
    const newMarks = Object.assign({}, marks)
    const assignment = newMarks.courses
      .get(course)
      .assignments.find((a) => a.name === assignmentName)
    if (type === 'earned') {
      assignment.points = points
    } else if (type === 'total') {
      assignment.total = points
    }
    assignment.modified = true
    return GradeUtil.calculatePoints(newMarks)
  }

  static addAssignment(
    marks: Marks,
    course: Course,
    assignment: string,
    category: string,
    points: number,
    total: number
  ) {
    let name = assignment.length === 0 ? 'Assignment' : assignment
    if (course.assignments.some((a) => a.name === name)) {
      let indentifier = 2
      while (course.assignments.some((a) => a.name === name + indentifier)) {
        indentifier++
      }
      name = name + indentifier
    }
    course.assignments.unshift({
      name: name,
      category: category,
      status: 'Graded',
      notes: '',
      points: points,
      total: total,
      modified: true,
      date: {
        due: new Date(),
        start: new Date()
      }
    })
    marks.courses.set(course.name, course)
    const m = Object.assign({}, marks)
    return GradeUtil.calculatePoints(m)
  }

  static calculateMarkColor(mark: number) {
    switch (this.calculateLetterGrade(mark)) {
      case 'A':
        return '#10C212'
      case 'B':
        return '#1E2EE6'
      case 'C':
        return '#F5A327'
      case 'D':
        return '#C72222'
      case 'E':
        return '#330505'
      case 'F':
        return Colors.black
    }
  }

  static calculateLetterGrade(mark: number) {
    if (mark >= 89.5) {
      return 'A'
    } else if (mark >= 79.5) {
      return 'B'
    } else if (mark >= 69.5) {
      return 'C'
    } else if (mark >= 59.5) {
      return 'D'
    } else if (mark >= 49.5) {
      return 'E'
    } else {
      return 'F'
    }
  }
}
