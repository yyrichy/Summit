import React from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'

const LoginView = ({ children }) =>
  Platform.select({
    web: () => <View style={styles.container}>{children}</View>,
    ios: () => (
      <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
        {children}
      </KeyboardAvoidingView>
    ),
    android: () => (
      <KeyboardAvoidingView style={styles.container} behavior={'height'}>
        {children}
      </KeyboardAvoidingView>
    )
  })()

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10
  }
})

export default LoginView
