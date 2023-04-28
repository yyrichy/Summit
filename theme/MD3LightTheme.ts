import { MD3Theme } from 'react-native-paper'
import color from 'color'
import configureFonts from './fonts'
import { palette, opacity } from './colors'

export const MD3LightTheme: MD3Theme = {
  dark: false,
  roundness: 4,
  version: 3,
  isV3: true,
  colors: {
    primary: palette.primary40,
    primaryContainer: palette.primary90,
    secondary: palette.secondary40,
    secondaryContainer: palette.secondary90,
    tertiary: palette.tertiary40,
    tertiaryContainer: palette.tertiary90,
    surface: palette.neutral99,
    surfaceVariant: palette.neutralVariant90,
    surfaceDisabled: color(palette.neutral10).alpha(opacity.level2).rgb().string(),
    background: palette.neutral99,
    error: palette.error40,
    errorContainer: palette.error90,
    onPrimary: palette.primary100,
    onPrimaryContainer: palette.primary10,
    onSecondary: palette.secondary100,
    onSecondaryContainer: palette.secondary10,
    onTertiary: palette.tertiary100,
    onTertiaryContainer: palette.tertiary10,
    onSurface: palette.neutral10,
    onSurfaceVariant: palette.neutralVariant30,
    onSurfaceDisabled: color(palette.neutral10).alpha(opacity.level4).rgb().string(),
    onError: palette.error100,
    onErrorContainer: palette.error10,
    onBackground: palette.neutral10,
    outline: palette.neutralVariant50,
    outlineVariant: palette.neutralVariant80,
    inverseSurface: palette.neutral20,
    inverseOnSurface: palette.neutral95,
    inversePrimary: palette.primary80,
    shadow: palette.neutral0,
    scrim: palette.neutral0,
    backdrop: color(palette.neutralVariant20).alpha(0.4).rgb().string(),
    elevation: {
      level0: 'transparent',
      level1: 'rgb(247, 243, 242)',
      level2: 'rgb(243, 239, 235)',
      level3: 'rgb(238, 234, 227)',
      level4: 'rgb(237, 232, 224)',
      level5: 'rgb(234, 229, 219)'
    }
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0
  }
}
