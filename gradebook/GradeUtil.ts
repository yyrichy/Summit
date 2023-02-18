import { Gradebook } from 'studentvue'
import { Colors } from '../colors/Colors'
import { Category, Course, Marks } from '../interfaces/Gradebook'
import { Dimensions, Platform, PixelRatio } from 'react-native'
import { round } from '../util/Util'
import { subDays } from 'date-fns'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const scale = SCREEN_WIDTH / 320

const normalize = (size: number): number => {
  const newSize = size * scale
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

// Some course names have the course ID at the end, ex: AP History A (SOC4935B)
const parseCourseName = (name: string): string => {
  return name.replace(/\([A-Z]{3}\d{4}[A-Z]\)/g, '')
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
                      status:
                        value != 'Not Graded' && value != 'Not Due'
                          ? 'Graded'
                          : value,
                      notes: a.notes,
                      points: points[0],
                      total: points[1],
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
      if (!isNaN(category.value) && category.show) {
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
const parsePoints = (points: string): number[] => {
  const regex = /^(\d+\.?\d*|\.\d+) \/ (\d+\.?\d*|\.\d+)$/
  if (points.match(regex)) {
    const p = points.split(regex)
    return [parseFloat(p[1]), parseFloat(p[2])]
  } else {
    return [NaN, parseFloat(points)]
  }
}

const deleteAssignment = (
  marks: Marks,
  course: string,
  assignment: string
): Marks => {
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
  const assignment = newMarks.courses
    .get(course)
    .assignments.find((a) => a.name === assignmentName)
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
      return '#378137'
    case 'B':
      return '#4C59EB'
    case 'C':
      return '#AD6800'
    case 'D':
      return '#CC3E3E'
    case 'E':
      return '#440808'
    case 'F':
      return Colors.black
  }
}

const calculateLetterGrade = (
  mark: number
): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' => {
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

const calculateBarColor = (value: number): string => {
  switch (calculateLetterGrade(value)) {
    case 'A':
      return '#4eba4e'
    case 'B':
      return '#6f8cf3'
    case 'C':
      return '#AD6800'
    case 'D':
      return '#CC3E3E'
    case 'E':
      return '#440808'
    case 'F':
      return Colors.black
  }
}

const isNumber = (input: string): boolean => {
  return /^[0-9.]+$/g.test(input)
}

const prependZero = (number): string => {
  if (number < 9) return '0' + number
  else return number
}

const formatAMPM = (date: Date): string => {
  let hours = date.getHours()
  let minutes: string | number = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'

  hours %= 12
  hours = hours || 12
  minutes = minutes < 10 ? `0${minutes}` : minutes

  const strTime = `${hours}:${minutes} ${ampm}`
  return strTime
}

const toggleCategory = (marks: Marks, course: Course, category: Category) => {
  category.show = !category.show
  course.categories.set(category.name, category)
  marks.courses.set(course.name, course)
  return calculatePoints(Object.assign({}, marks))
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
  isNumber,
  normalize,
  prependZero,
  formatAMPM,
  toggleCategory,
  calculateBarColor,
  testMarks,
  getClassGPA
}
