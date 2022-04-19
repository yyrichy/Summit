import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

type Props = {
  onPress: any
  text: string
  backgroundColor: string
  textColor: string
}

const CustomButton: React.FC<Props> = ({
  onPress,
  text,
  backgroundColor,
  textColor
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.buttonContainer, { backgroundColor: backgroundColor }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 20,
    textAlign: 'center'
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: 100,
    height: 50,
    padding: 10,
    borderRadius: 10,
    borderWidth: 0,
    marginBottom: 10
  }
})

export default CustomButton
