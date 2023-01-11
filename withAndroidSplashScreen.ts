import type { ConfigPlugin } from '@expo/config-plugins'
import { AndroidConfig, withStringsXml } from '@expo/config-plugins'

const withAndroidSplashScreen: ConfigPlugin = (expoConfig) =>
  withStringsXml(expoConfig, (modConfig) => {
    modConfig.modResults = AndroidConfig.Strings.setStringItem(
      [
        {
          _: 'true',
          $: {
            name: 'expo_splash_screen_status_bar_translucent',
            translatable: 'false'
          }
        }
      ],
      modConfig.modResults
    )
    return modConfig
  })

export default withAndroidSplashScreen
