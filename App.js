import Login from './screens/Login';
import BottomNavigation from './navigation/BottomNavigation'
import { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default class App extends Component{
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name='Login' component={Login} options={{ headerTitleAlign: 'center' }}/>
                    <Stack.Screen name='Menu' component={BottomNavigation} options={{ headerTitle: '' }}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
