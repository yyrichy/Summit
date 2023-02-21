import { Colors } from '../colors/Colors'
import { MD3DarkTheme } from './MD3DarkTheme'

export const DarkTheme = {
  dark: true,
  colors: {
    primary: Colors.off_white,
    background: MD3DarkTheme.colors.background,
    card: MD3DarkTheme.colors.surface,
    text: Colors.white,
    border: Colors.secondary,
    notification: Colors.accent
  }
}
