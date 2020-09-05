console.disableYellowBox = true;
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import MapScreen from './screens/MapScreen';
// import POIScreen from './screens/POIScreen'
import {createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';

import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import pseudo from './reducers/pseudo';

const store = createStore(combineReducers({pseudo}));


var BottomNavigator = createBottomTabNavigator({
  Map : MapScreen,
  Chat : ChatScreen,
  // POI : POIScreen
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => {
      var iconName;
      if (navigation.state.routeName == 'Map') {
        iconName = 'ios-navigate';
      } else if (navigation.state.routeName == 'Chat') {
        iconName = 'ios-chatboxes';
      }

      return <Ionicons name={iconName} size={25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: '#eb4d4b',
    inactiveTintColor: '#FFFFFF',
    style: {
      backgroundColor: '#130f40',
    }
  },
}
);

var StackNavigator = createStackNavigator({
  Home : HomeScreen,
  Nav : BottomNavigator
},
{
  headerMode: 'none'
}
);

const Navigation = createAppContainer(StackNavigator);

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
 }

