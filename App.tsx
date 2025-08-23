import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import MatchsScreen from './src/screens/MatchsScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ClassementScreen from './src/screens/ClassementScreen';
import AddMatchScreen from './src/screens/AddMatchScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MatchsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="MatchsList" 
      component={MatchsScreen}
      options={{ 
        title: 'Matchs',
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }} 
    />
    <Stack.Screen 
      name="AddMatch" 
      component={AddMatchScreen}
      options={{ 
        title: 'Nouveau Match',
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }} 
    />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666',
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="Matchs" 
          component={MatchsStack}
          options={{
            tabBarLabel: 'Matchs'
          }}
        />
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{
            title: 'Dashboard',
            tabBarLabel: 'Dashboard',
            headerShown: true,
            headerStyle: { backgroundColor: '#007AFF' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }}
        />
        <Tab.Screen 
          name="Classement" 
          component={ClassementScreen}
          options={{
            title: 'Classement Global',
            tabBarLabel: 'Classement',
            headerShown: true,
            headerStyle: { backgroundColor: '#007AFF' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}