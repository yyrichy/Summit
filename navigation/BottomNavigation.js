import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Grades from '../screens/Grades';
import StudentInfo from '../screens/StudentInfo';
import { useState } from 'react';
import AppContext from '../components/AppContext';

const Tab = createBottomTabNavigator();

const App = ({ route }) => {
    const [username] = useState(route.params.user.username);
    const [password] = useState(route.params.user.password);

    return (
        <AppContext.Provider value={{ user: {username: username, password: password} }}>
            <Tab.Navigator>
                <Tab.Screen name='Grades' component={Grades} options={{ headerTitleAlign: 'center' }} />
                <Tab.Screen name='Student Info' component={StudentInfo} options={{ headerTitleAlign: 'center' }} />
            </Tab.Navigator>
        </AppContext.Provider>
    );
}

export default App;