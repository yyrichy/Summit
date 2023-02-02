import { format, isBefore, isToday, isTomorrow, isYesterday } from 'date-fns'
import Toast from 'react-native-root-toast'
import { Colors } from '../colors/Colors'

const toast = (message: string) => {
  Toast.show(message, {
    duration: Toast.durations.SHORT,
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

  // If one week or more in past/future
  if (Math.abs(date.getTime() - today.getTime()) / (1000 * 3600 * 24) > 6)
    return date.toLocaleDateString()

  if (isBefore(date, today)) {
    return `Past ${format(date, `EEEE`)}`
  } else {
    return format(date, `EEEE`)
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

const round = (value: string | number, decimals: string | number): number => {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals)
}

export { toast, dateRelativeToToday, getOrdinal, round }
