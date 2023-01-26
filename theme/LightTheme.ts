import { Colors } from '../colors/Colors'
import { MD3LightTheme } from './MD3LightTheme'

export const NavLightTheme = {
  dark: false,
  colors: {
    primary: Colors.primary,
    background: MD3LightTheme.colors.background,
    card: MD3LightTheme.colors.surface,
    text: Colors.black,
    border: Colors.secondary,
    notification: Colors.accent
  }
}
