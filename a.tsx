import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, SafeAreaView, Easing } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const App = () => {
  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const lowestScale = 0.4
  const fadeAnim = useRef(new Animated.Value(0)).current
  const fadeAnim2 = useRef(new Animated.Value(1)).current
  const scaleAnim = useRef(new Animated.Value(lowestScale)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 750,
          easing: Easing.elastic(1),
          useNativeDriver: true
        }),
        Animated.timing(scaleAnim, {
          toValue: lowestScale,
          duration: 750,
          easing: Easing.back(1),
          useNativeDriver: true
        })
      ])
    ).start()
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true
        })
      ])
    ).start()
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim2, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim2, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true
        })
      ])
    ).start()
  })

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.fadingContainer,
          {
            // Bind opacity to animated value
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Ionicons name="calendar" size={64} color="black" />
      </Animated.View>
      <Animated.View
        style={[
          styles.fadingContainer,
          {
            opacity: fadeAnim2,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Ionicons name="calendar-outline" size={64} color="black" />
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fadingContainer: {
    position: 'absolute'
  }
})

export default App
