import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

type Props = {
  onPress: any
  text: string
  backgroundColor: string
}

const CustomButton: React.FC<Props> = ({
  onPress,
  text,
  backgroundColor
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.buttonContainer, { backgroundColor: backgroundColor }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: "white"
  },
  buttonContainer: {
    justifyContent: "center",
    width: 100,
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: "#3EB489",
    marginBottom: 10
  }
})

export default CustomButton
