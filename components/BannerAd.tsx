import React from 'react'
import { Platform, View, ViewStyle } from 'react-native'
import {
  TestIds,
  BannerAdSize,
  BannerAd as Banner
} from 'react-native-google-mobile-ads'

type Props = {
  size?: string
  style?: ViewStyle
}

const BannerAd: React.FC<Props> = ({ size, style }: Props) => {
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : Platform.OS == 'android'
    ? 'ca-app-pub-7084446430900509/6692537871'
    : 'ca-app-pub-7084446430900509/4838214937'

  return (
    <View style={style}>
      <Banner
        unitId={adUnitId}
        size={size || BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  )
}

export default BannerAd
