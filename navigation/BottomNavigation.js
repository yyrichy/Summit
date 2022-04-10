import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Grades from '../screens/Grades';
import StudentInfo from '../screens/StudentInfo';
import { Component } from 'react';

const Tab = createBottomTabNavigator();

export default class App extends Component {
    render() {
        return (
            <Tab.Navigator>
                <Tab.Screen name='Grades' component={Grades} options={{ headerTitleAlign: 'center' }}/>
                <Tab.Screen name='Student Info' component={StudentInfo} options={{ headerTitleAlign: 'center' }}/>
            </Tab.Navigator>
        );
    }
}