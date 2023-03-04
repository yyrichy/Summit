import { Gradebook } from 'studentvue'
import { Category, Course, Marks } from '../interfaces/Gradebook'
import { round } from '../util/Util'
import { subDays } from 'date-fns'

// Some course names have the course ID at the end, ex: AP History A (SOC4935B)
const parseCourseName = (name: string): string => {
  return name.replace(/\([A-Z]{3}\d{4}[A-Z]?\)/g, '')
}

const convertGradebook = (gradebook: Gradebook) => {
  const marks: Marks = {
    gpa: 0,
    courses: new Map<string, Course>(
      gradebook.courses.map((course) => {
        return [
          course.title,
          {
            name: course.title,
            period: course.period,
            teacher: {
              name: course.staff.name,
              email: course.staff.email
            },
            assignments:
              course.marks.length > 0
                ? course.marks[0].assignments.map((a) => {
                    const value = a.score.value
                    const points = parsePoints(a.points)
                    return {
                      name: a.name,
                      category: a.type,
                      status: value != 'Not Graded' && value != 'Not Due' ? 'Graded' : value,
                      notes: a.notes,
                      points: points.earned,
                      total: points.total,
                      modified: false,
                      date: a.date
                    }
                  })
                : [],
            categories:
              course.marks.length > 0
                ? new Map<string, Category>(
                    course.marks[0].weightedCategories
                      .filter((c) => c.type.toLowerCase() !== 'total')
                      .map((c) => [
                        c.type,
                        {
                          name: c.type,
                          weight: parseFloat(c.weight.standard),
                          show: true
                        } as Category
                      ])
                  )
                : null,
            room: course.room
          } as Course
        ]
      })
    ),
    reportingPeriod: gradebook.reportingPeriod.current,
    reportingPeriods: gradebook.reportingPeriod.available
  }
  return calculatePoints(marks)
}

const calculatePoints = (marks: Marks): Marks => {
  let gpa = 0
  let numOfCourses = 0
  for (const course of marks.courses.values()) {
    let points = 0
    let total = 0
    course.value = NaN
    for (const category of course.categories.values()) {
      ;(category.points = 0), (category.total = 0), (category.value = NaN)
    }
    for (const assignment of course.assignments) {
      const category = course.categories.get(assignment.category)
      if (category && !isNaN(assignment.points) && !isNaN(assignment.total)) {
        category.points += assignment.points
        category.total += assignment.total
        category.value = (category.points / category.total) * 100
      }
    }
    for (const category of course.categories.values()) {
      if (!isNaN(category.value)) {
        points += (category.value / 100) * category.weight
        total += category.weight
      }
    }
    course.value = (points / total) * 100
    if (!isNaN(course.value)) {
      gpa += getClassGPA(course.value)
      numOfCourses++
    }
  }
  marks.gpa = round(gpa / numOfCourses, 2)
  return marks
}

const getClassGPA = (value: number) => {
  switch (calculateLetterGrade(value)) {
    case 'A':
      return 4
    case 'B':
      return 3
    case 'C':
      return 2
    case 'D':
      return 1
    default:
      return 0
  }
}

/*
  Assignment.points has two possible formats
  15.0000 Points Possible
  5.00 / 5.0000
*/
const parsePoints = (points: string): { earned: number; total: number } => {
  const regex = /^(\d+\.?\d*|\.\d+) \/ (\d+\.?\d*|\.\d+)$/
  if (points.match(regex)) {
    const p = points.split(regex)
    return { earned: parseFloat(p[1]), total: parseFloat(p[2]) }
  } else {
    return { earned: NaN, total: parseFloat(points) }
  }
}

const deleteAssignment = (marks: Marks, course: string, assignment: string): Marks => {
  const newMarks = Object.assign({}, marks)
  newMarks.courses.get(course).assignments = newMarks.courses
    .get(course)
    .assignments.filter((a) => a.name !== assignment)
  return calculatePoints(newMarks)
}

const updatePoints = (
  marks: Marks,
  course: string,
  assignmentName: string,
  points: number,
  type: string
): Marks => {
  const newMarks = Object.assign({}, marks)
  const assignment = newMarks.courses.get(course).assignments.find((a) => a.name === assignmentName)
  if (type === 'earned') {
    assignment.points = points
  } else if (type === 'total') {
    assignment.total = points
  }
  assignment.modified = true
  return calculatePoints(newMarks)
}

const addAssignment = (
  marks: Marks,
  course: Course,
  category: string,
  points: number,
  total: number
): Marks => {
  let name = 'Assignment'
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
  return calculatePoints(m)
}

const calculateMarkColor = (value: number): string => {
  switch (calculateLetterGrade(value)) {
    case 'A':
      return '#5bac5b'
    case 'B':
      return '#5664fe'
    case 'C':
      return '#aaa40a'
    case 'D':
      return '#e99535'
    case 'E':
      return '#b53232'
    case 'F':
      return '#512a1f'
  }
}

const calculateLetterGrade = (mark: number): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' => {
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

const testMarks = (): Marks => {
  const m: Marks = require('../assets/test.json').marks
  const rp = m.reportingPeriod
  rp.date.end = new Date(rp.date.end)
  rp.date.start = new Date(rp.date.start)
  m.reportingPeriod = rp
  m.courses = new Map()
  m.courses.set('Algebra 1', {
    name: 'Algebra 1',
    period: 1,
    teacher: { name: 'Lynda Caldwell', email: 'LyndaCaldwell@school.org' },
    value: 87.2,
    assignments: [
      {
        name: 'Real Numbers and Operations',
        category: 'Assessments',
        status: 'Graded',
        notes: '',
        points: 9,
        total: 12,
        modified: false,
        date: {
          due: new Date(),
          start: new Date()
        }
      },
      {
        name: 'Pop Quiz',
        category: 'Assessments',
        status: 'Graded',
        notes: '',
        points: 8,
        total: 10,
        modified: false,
        date: {
          due: subDays(new Date(), 2),
          start: subDays(new Date(), 2)
        }
      },
      {
        name: 'Homework Week 2',
        category: 'Practice',
        status: 'Graded',
        notes: 'Turned in late',
        points: 9,
        total: 10,
        modified: false,
        date: {
          due: subDays(new Date(), 5),
          start: subDays(new Date(), 12)
        }
      },
      {
        name: 'Factoring Quiz',
        category: 'Assessments',
        status: 'Graded',
        notes: '',
        points: 19,
        total: 20,
        modified: false,
        date: {
          due: subDays(new Date(), 6),
          start: subDays(new Date(), 6)
        }
      },
      {
        name: 'Linear Equations Graphs',
        category: 'Assessments',
        status: 'Graded',
        notes: '',
        points: 8,
        total: 10,
        modified: false,
        date: {
          due: subDays(new Date(), 9),
          start: subDays(new Date(), 12)
        }
      },
      {
        name: 'Group Project',
        category: 'Practice',
        status: 'Graded',
        notes: '',
        points: 17,
        total: 20,
        modified: false,
        date: {
          due: subDays(new Date(), 10),
          start: subDays(new Date(), 14)
        }
      },
      {
        name: 'Homework Week 1',
        category: 'Practice',
        status: 'Graded',
        notes: '',
        points: 10,
        total: 10,
        modified: false,
        date: {
          due: subDays(new Date(), 11),
          start: subDays(new Date(), 18)
        }
      },
      {
        name: 'Cumalative Exam',
        category: 'Assessments',
        status: 'Graded',
        notes: '',
        points: 47,
        total: 50,
        modified: false,
        date: {
          due: subDays(new Date(), 16),
          start: subDays(new Date(), 16)
        }
      },
      {
        name: 'Systems of Equations Quiz',
        category: 'Assessments',
        status: 'Graded',
        notes: '',
        points: 15,
        total: 20,
        modified: false,
        date: {
          due: subDays(new Date(), 20),
          start: subDays(new Date(), 20)
        }
      }
    ],
    categories: new Map([
      [
        'Practice',
        {
          name: 'Practice',
          points: 9,
          total: 10,
          value: 90,
          weight: 10,
          show: true
        }
      ],
      [
        'Assessments',
        {
          name: 'Assessments',
          points: 86.69,
          total: 100,
          value: 86.69,
          weight: 90,
          show: true
        }
      ]
    ]),
    room: '109'
  })
  m.courses.set('Hon English', {
    name: 'Hon English',
    period: 2,
    teacher: { name: 'Rochelle Tucker', email: 'RochelleTucker@school.org' },
    value: 83.2,
    assignments: [],
    categories: new Map(),
    room: '230'
  })
  m.courses.set('AP US History B', {
    name: 'AP US History B',
    period: 3,
    teacher: { name: 'Tami Scott', email: 'TamiScott@school.org' },
    value: 95,
    assignments: [],
    categories: new Map(),
    room: '252'
  })
  m.courses.set('Physical Education', {
    name: 'Physical Education',
    period: 4,
    teacher: { name: 'Nina Sanchez', email: 'NinaSanchez@school.org' },
    value: 98.33,
    assignments: [],
    categories: new Map(),
    room: '23'
  })
  m.courses.set('AP Biology B', {
    name: 'AP Biology B',
    period: 5,
    teacher: { name: 'Jim Weber', email: 'JimWeber@school.org' },
    value: 75.5,
    assignments: [],
    categories: new Map(),
    room: '347'
  })
  m.courses.set('French 3 B', {
    name: 'French 3 B',
    period: 6,
    teacher: { name: 'Angel Lee', email: 'AngelLee@school.org' },
    value: 82.44,
    assignments: [],
    categories: new Map(),
    room: '192'
  })
  m.courses.set('Forensic Science', {
    name: 'Forensic Science',
    period: 7,
    teacher: { name: 'Ellis Robbins', email: 'EllisRobbins@school.org' },
    value: 92.37,
    assignments: [],
    categories: new Map(),
    room: '289'
  })
  return m
}

// Replace "ABC1234 " and " - ABC1234-1234(or 5)"
const parseScheduleCourseName = (name: string) => {
  return name
    .replace(/[A-Z]{3}\d{4}[A-Z]?\s/g, '')
    .replace(/\s-\s[A-Za-z]{3}\d{4}[A-Za-z]?-\d{4,5}/g, '')
}

export {
  parseCourseName,
  convertGradebook,
  calculatePoints,
  parsePoints,
  deleteAssignment,
  updatePoints,
  addAssignment,
  calculateMarkColor,
  calculateLetterGrade,
  testMarks,
  getClassGPA,
  parseScheduleCourseName
}
