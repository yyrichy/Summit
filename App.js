import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from './screens/login';
import Home from './screens/home';

const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  Home: { screen: Home }
});

const Container = createAppContainer(AppNavigator);

export default Container; 
