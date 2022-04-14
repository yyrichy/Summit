import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Grades from '../screens/Grades';
import StudentInfo from '../screens/StudentInfo';
import { useState } from 'react';
import AppContext from '../components/AppContext';

const Tab = createBottomTabNavigator();

const App = ({ route }) => {
    const [username, setUsername] = useState(route.params.user.username);
    const [password, setPassword] = useState(route.params.user.password);
    const [client, setClient] = useState(route.params.user.client);
    const user = {
        username: username,
        password: password,
        client: client,
        setUsername,
        setPassword,
        setClient
    }

    return (
        <AppContext.Provider value={user}>
            <Tab.Navigator>
                <Tab.Screen name='Grades' component={Grades} options={{ headerTitleAlign: 'center' }} />
                <Tab.Screen name='Student Info' component={StudentInfo} options={{ headerTitleAlign: 'center' }} />
            </Tab.Navigator>
        </AppContext.Provider>
    );
}

export default App;