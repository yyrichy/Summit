import Login from "./screens/Login"
import React from 'react';
import BottomNavigation from "./navigation/BottomNavigation"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { RootStackParamList } from "./screens/RootStackParams"

const Stack = createStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="Menu"
          component={BottomNavigation}
          options={{ headerTitle: "" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
