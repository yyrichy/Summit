import React, { useEffect } from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated'

type Props = {
  children: any
  open: boolean
  height: number
}

const Accordion: React.FC<Props> = ({ children, open, height }) => {
  const heightAnimation = useSharedValue(0)

  useEffect(() => {
    if (open) {
      heightAnimation.value = height
    } else {
      heightAnimation.value = 0
    }
  }, [open])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(heightAnimation.value, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      })
    }
  })

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}

export default Accordion
