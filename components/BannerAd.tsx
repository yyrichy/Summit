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
  iosId: string
  androidId: string
}

const BannerAd: React.FC<Props> = ({
  size,
  style,
  iosId,
  androidId
}: Props) => {
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : Platform.OS == 'android'
    ? androidId
    : iosId

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
