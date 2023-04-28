import color from 'color'
import { MD3Theme } from 'react-native-paper'

import { opacity, palette } from './colors'
import configureFonts from './fonts'

export const MD3DarkTheme: MD3Theme = {
  dark: true,
  mode: 'adaptive',
  roundness: 4,
  version: 3,
  isV3: true,
  colors: {
    primary: palette.primary80,
    primaryContainer: palette.primary30,
    secondary: palette.secondary80,
    secondaryContainer: palette.secondary30,
    tertiary: palette.tertiary80,
    tertiaryContainer: palette.tertiary30,
    surface: palette.neutral10,
    surfaceVariant: palette.neutralVariant30,
    surfaceDisabled: color(palette.neutral90).alpha(opacity.level2).rgb().string(),
    background: palette.neutral10,
    error: palette.error80,
    errorContainer: palette.error30,
    onPrimary: palette.primary20,
    onPrimaryContainer: palette.primary90,
    onSecondary: palette.secondary20,
    onSecondaryContainer: palette.secondary90,
    onTertiary: palette.tertiary20,
    onTertiaryContainer: palette.tertiary90,
    onSurface: palette.neutral90,
    onSurfaceVariant: palette.neutralVariant80,
    onSurfaceDisabled: color(palette.neutral90).alpha(opacity.level4).rgb().string(),
    onError: palette.error20,
    onErrorContainer: palette.error80,
    onBackground: palette.neutral90,
    outline: palette.neutralVariant60,
    outlineVariant: palette.neutralVariant30,
    inverseSurface: palette.neutral90,
    inverseOnSurface: palette.neutral20,
    inversePrimary: palette.primary40,
    shadow: palette.neutral0,
    scrim: palette.neutral0,
    backdrop: color(palette.neutralVariant20).alpha(0.4).rgb().string(),
    elevation: {
      level0: 'transparent',
      level1: 'rgb(38, 37, 23)',
      level2: 'rgb(44, 42, 24)',
      level3: 'rgb(49, 47, 25)',
      level4: 'rgb(51, 49, 25)',
      level5: 'rgb(55, 52, 26)'
    }
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0
  }
}
