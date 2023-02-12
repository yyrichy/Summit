export default {
  expo: {
    name: 'GradeHelper',
    slug: 'Summit',
    version: '1.1.4',
    orientation: 'portrait',
    icon: './assets/icon.png',
    platforms: ['android', 'ios'],
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#FEF156'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.vaporys.Summit',
      infoPlist: {
        LSApplicationQueriesSchemes: ['instagram']
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FEF156'
      },
      package: 'com.vaporys.Summit',
      softwareKeyboardLayoutMode: 'pan',
      versionCode: 18
    },
    androidStatusBar: {
      barStyle: 'dark-content'
    },
    plugins: [
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png'
        }
      ],
      ['./withAndroidSplashScreen.js'],
      [
        'expo-build-properties',
        {
          android: {
            enableProguardInReleaseBuilds: true
          }
        }
      ]
    ],
    userInterfaceStyle: 'light',
    extra: {
      LOGIN_BANNER_IOS: process.env.LOGIN_BANNER_IOS,
      LOGIN_BANNER_ANDROID: process.env.LOGIN_BANNER_ANDROID,
      COURSES_BANNER_IOS: process.env.COURSES_BANNER_IOS,
      COURSES_BANNER_ANDROID: process.env.COURSES_BANNER_ANDROID,
      DETAILS_BANNER_IOS: process.env.DETAILS_BANNER_IOS,
      DETAILS_BANNER_ANDROID: process.env.DETAILS_BANNER_ANDROID,
      eas: {
        projectId: 'd59960c3-3bf2-4243-b9d3-22051792b8bc'
      }
    }
  }
}
