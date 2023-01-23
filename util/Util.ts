import {
  format,
  intervalToDuration,
  isBefore,
  isSameWeek,
  isToday,
  isTomorrow,
  isYesterday
} from 'date-fns'
import Toast from 'react-native-root-toast'
import { Colors } from '../colors/Colors'

const toast = (message: string) => {
  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM - 30,
    shadow: false,
    animation: true,
    hideOnPress: true,
    opacity: 0.9,
    textColor: Colors.black,
    backgroundColor: Colors.white,
    containerStyle: {
      height: 48,
      justifyContent: 'center'
    }
  })
}

const dateRelativeToToday = (date: Date) => {
  const today = new Date()
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  if (isTomorrow(date)) return 'Tommorow'

  // If more than one week in distance
  if (Math.abs(intervalToDuration({ start: today, end: date }).days) > 7)
    return date.toLocaleDateString()

  if (isBefore(date, today)) {
    if (isSameWeek(today, date, { weekStartsOn: 1 }))
      return `Past ${format(date, `EEEE`)} the ${format(date, 'Do')}`

    return `Last ${format(date, `EEEE`)} the ${format(date, 'Do')}`
  } else {
    return `${format(date, `EEEE`)}`
  }
}

const getOrdinal = (num: number): 'st' | 'nd' | 'rd' | 'th' | '' => {
  if (isNaN(num)) return ''
  const j = num % 10,
    k = num % 100
  if (j === 1 && k !== 11) {
    return 'st'
  }
  if (j === 2 && k !== 12) {
    return 'nd'
  }
  if (j === 3 && k !== 13) {
    return 'rd'
  }
  return 'th'
}

export { toast, dateRelativeToToday, getOrdinal }
