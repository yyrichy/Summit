import { MD3Theme } from 'react-native-paper'
import color from 'color'
import configureFonts from './fonts'

export const MD3LightTheme: MD3Theme = {
  dark: false,
  roundness: 4,
  version: 3,
  isV3: true,
  colors: {
    primary: '#676000',
    primaryContainer: '#f3e64c',
    secondary: '#616200',
    secondaryContainer: '#e8e970',
    tertiary: '#006a64',
    tertiaryContainer: '#71f7ec',
    surface: '#fdfbff',
    surfaceVariant: '#e7e3d0',
    surfaceDisabled: color('#001b3d').alpha('0.12').rgb().string(),
    background: '#fdfbff',
    error: '#ba1a1a',
    errorContainer: '#ffdad6',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#1f1c00',
    onSecondary: '#ffffff',
    onSecondaryContainer: '#1d1d00',
    onTertiary: '#ffffff',
    onTertiaryContainer: '#00201e',
    onSurface: '#001b3d',
    onSurfaceVariant: '#49473a',
    onSurfaceDisabled: color('#001b3d').alpha('0.38').rgb().string(),
    onError: '#ffffff',
    onErrorContainer: '#410002',
    onBackground: '#001b3d',
    outline: '#7a7768',
    outlineVariant: '#cbc7b5',
    inverseSurface: '#003062',
    inverseOnSurface: '#ecf0ff',
    inversePrimary: '#d6ca30',
    shadow: '#000000',
    scrim: '#000000',
    backdrop: color('#323124').alpha(0.4).rgb().string(),
    elevation: {
      level0: 'transparent',
      // Note: Color values with transparency cause RN to transfer shadows to children nodes
      // instead of View component in Surface. Providing solid background fixes the issue.
      // Opaque color values generated with `palette.primary99` used as background
      level1: color('#676000').alpha(0.05).rgb().string(), // palette.primary40, alpha 0.05
      level2: color('#676000').alpha(0.08).rgb().string(), // palette.primary40, alpha 0.08
      level3: color('#676000').alpha(0.11).rgb().string(), // palette.primary40, alpha 0.11
      level4: color('#676000').alpha(0.12).rgb().string(), // palette.primary40, alpha 0.12
      level5: color('#676000').alpha(0.14).rgb().string() // palette.primary40, alpha 0.14
    }
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0
  }
}
