import { Platform, PlatformOSType } from 'react-native'

import type {
  Font,
  Fonts,
  MD3Type,
  MD3Typescale,
  MD3TypescaleKey
} from 'react-native-paper/lib/typescript/types'

const typeface = {
  brandRegular: Platform.select({
    ios: 'Roboto_400Regular',
    default: 'Roboto_400Regular'
  }),
  weightRegular: '400' as Font['fontWeight'],

  plainMedium: Platform.select({
    ios: 'Roboto_500Medium',
    default: 'Roboto_500Medium'
  }),
  weightMedium: '500' as Font['fontWeight']
}

const regularType = {
  fontFamily: typeface.brandRegular,
  letterSpacing: 0,
  fontWeight: typeface.weightRegular
}

const mediumType = {
  fontFamily: typeface.plainMedium,
  letterSpacing: 0.15,
  fontWeight: typeface.weightMedium
}

export const typescale = {
  displayLarge: {
    ...regularType,
    lineHeight: 64,
    fontSize: 57
  },
  displayMedium: {
    ...regularType,
    lineHeight: 52,
    fontSize: 45
  },
  displaySmall: {
    ...regularType,
    lineHeight: 44,
    fontSize: 36
  },

  headlineLarge: {
    ...regularType,
    lineHeight: 40,
    fontSize: 32
  },
  headlineMedium: {
    ...regularType,
    lineHeight: 36,
    fontSize: 28
  },
  headlineSmall: {
    ...regularType,
    lineHeight: 32,
    fontSize: 24
  },

  titleLarge: {
    ...regularType,
    lineHeight: 28,
    fontSize: 22
  },
  titleMedium: {
    ...mediumType,
    lineHeight: 24,
    fontSize: 16
  },
  titleSmall: {
    ...mediumType,
    letterSpacing: 0.1,
    lineHeight: 20,
    fontSize: 14
  },

  labelLarge: {
    ...mediumType,
    letterSpacing: 0.1,
    lineHeight: 20,
    fontSize: 14
  },
  labelMedium: {
    ...mediumType,
    letterSpacing: 0.5,
    lineHeight: 16,
    fontSize: 12
  },
  labelSmall: {
    ...mediumType,
    letterSpacing: 0.5,
    lineHeight: 16,
    fontSize: 11
  },

  bodyLarge: {
    ...mediumType,
    fontWeight: typeface.weightRegular,
    fontFamily: typeface.brandRegular,
    lineHeight: 24,
    fontSize: 16
  },
  bodyMedium: {
    ...mediumType,
    fontWeight: typeface.weightRegular,
    fontFamily: typeface.brandRegular,
    letterSpacing: 0.25,
    lineHeight: 20,
    fontSize: 14
  },
  bodySmall: {
    ...mediumType,
    fontWeight: typeface.weightRegular,
    fontFamily: typeface.brandRegular,
    letterSpacing: 0.4,
    lineHeight: 16,
    fontSize: 12
  },

  default: {
    ...regularType
  }
}

export const fontConfig = {
  ios: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as '400'
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as '500'
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300' as '300'
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100' as '100'
    }
  },
  default: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal' as 'normal'
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal' as 'normal'
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal' as 'normal'
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal' as 'normal'
    }
  }
}

type MD2FontsConfig = {
  [platform in PlatformOSType | 'default']?: Fonts
}

type MD3FontsConfig =
  | {
      [key in MD3TypescaleKey]: Partial<MD3Type>
    }
  | {
      [key: string]: MD3Type
    }
  | Partial<MD3Type>

function configureV2Fonts(config: MD2FontsConfig): Fonts {
  const fonts = Platform.select({ ...fontConfig, ...config }) as Fonts
  return fonts
}

function configureV3Fonts(
  config: MD3FontsConfig
): MD3Typescale | (MD3Typescale & { [key: string]: MD3Type }) {
  if (!config) {
    return typescale
  }

  const isFlatConfig = Object.keys(config).every(
    (key) => typeof config[key as keyof typeof config] !== 'object'
  )

  if (isFlatConfig) {
    return Object.fromEntries(
      Object.entries(typescale).map(([variantName, variantProperties]) => [
        variantName,
        { ...variantProperties, ...config }
      ])
    ) as MD3Typescale
  }

  return Object.assign(
    typescale,
    ...Object.entries(config).map(([variantName, variantProperties]) => ({
      [variantName]: {
        ...typescale[variantName as MD3TypescaleKey],
        ...variantProperties
      }
    }))
  )
}

// eslint-disable-next-line no-redeclare
export default function configureFonts(params: { isV3: false }): Fonts
// eslint-disable-next-line no-redeclare
export default function configureFonts(params: { config?: MD2FontsConfig; isV3: false }): Fonts
// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: {
  config?: Partial<MD3Type>
  isV3?: true
}): MD3Typescale
// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: {
  config?: Partial<Record<MD3TypescaleKey, Partial<MD3Type>>>
  isV3?: true
}): MD3Typescale
// eslint-disable-next-line no-redeclare
export default function configureFonts(params: {
  config: Record<string, MD3Type>
  isV3?: true
}): MD3Typescale & { [key: string]: MD3Type }
// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: any) {
  const { isV3 = true, config } = params || {}

  if (isV3) {
    return configureV3Fonts(config)
  }
  return configureV2Fonts(config)
}
