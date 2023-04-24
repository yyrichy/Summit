import type { WithAndroidWidgetsParams } from 'react-native-android-widget'

const widgetConfig: WithAndroidWidgetsParams = {
  fonts: ['./assets/material.ttf'],
  widgets: [
    {
      name: 'Grades', // This name will be the **name** with which we will reference our widget.
      label: 'Course Grades', // Label shown in the widget picker
      minWidth: '320dp',
      minHeight: '120dp',
      previewImage: './assets/grades-widget.png'
    }
  ]
}

const LIGHT_SPLASH = {
  image: './assets/splash.png',
  resizeMode: 'contain',
  backgroundColor: '#FEF156'
}

const DARK_SPLASH = {
  image: './assets/splash-dark.png',
  resizeMode: 'contain',
  backgroundColor: '#000000'
}

const SHARED_SPLASH = {
  splash: {
    ...LIGHT_SPLASH,
    dark: {
      ...DARK_SPLASH
    }
  }
}

export default {
  expo: {
    name: 'GradeHelper',
    slug: 'Summit',
    version: '1.3.18',
    orientation: 'portrait',
    icon: './assets/icon.png',
    platforms: ['android', 'ios'],
    splash: LIGHT_SPLASH,
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      ...SHARED_SPLASH,
      userInterfaceStyle: 'automatic',
      supportsTablet: true,
      bundleIdentifier: 'com.vaporys.Summit',
      infoPlist: {
        LSApplicationQueriesSchemes: ['instagram']
      }
    },
    android: {
      ...SHARED_SPLASH,
      userInterfaceStyle: 'automatic',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FEF156'
      },
      package: 'com.vaporys.Summit',
      softwareKeyboardLayoutMode: 'pan',
      versionCode: 48
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
            enableProguardInReleaseBuilds: true,
            compileSdkVersion: 33
          }
        }
      ],
      'sentry-expo',
      ['react-native-android-widget', widgetConfig],
      'react-native-background-fetch'
    ],
    userInterfaceStyle: 'automatic',
    extra: {
      LOGIN_BANNER_IOS: process.env.LOGIN_BANNER_IOS,
      LOGIN_BANNER_ANDROID: process.env.LOGIN_BANNER_ANDROID,
      COURSES_BANNER_IOS: process.env.COURSES_BANNER_IOS,
      COURSES_BANNER_ANDROID: process.env.COURSES_BANNER_ANDROID,
      DETAILS_BANNER_IOS: process.env.DETAILS_BANNER_IOS,
      DETAILS_BANNER_ANDROID: process.env.DETAILS_BANNER_ANDROID,
      COURSES_INTER_IOS: process.env.COURSES_INTER_IOS,
      COURSES_INTER_ANDROID: process.env.COURSES_INTER_ANDROID,
      eas: {
        projectId: 'd59960c3-3bf2-4243-b9d3-22051792b8bc'
      }
    }
  }
}
