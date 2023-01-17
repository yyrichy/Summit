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
    backgroundColor: Colors.white
  })
}

export { toast }
