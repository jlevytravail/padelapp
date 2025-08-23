import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import MatchsScreen from './src/screens/MatchsScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ClassementScreen from './src/screens/ClassementScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tab.Screen 
          name="Matchs" 
          component={MatchsScreen}
          options={{
            title: 'Matchs',
            tabBarLabel: 'Matchs'
          }}
        />
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{
            title: 'Dashboard',
            tabBarLabel: 'Dashboard'
          }}
        />
        <Tab.Screen 
          name="Classement" 
          component={ClassementScreen}
          options={{
            title: 'Classement Global',
            tabBarLabel: 'Classement'
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}