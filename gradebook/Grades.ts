import { Marks } from '../interfaces/Gradebook'

export default class Grades {
  marks: Marks
  constructor(marks: Marks) {
    this.marks = marks
  }
}
