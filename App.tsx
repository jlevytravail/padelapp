import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

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
        headerStyle: { 
          backgroundColor: '#1A73E8',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        headerTintColor: '#fff',
        headerTitleStyle: { 
          fontWeight: '700',
          fontSize: 18,
        }
      }} 
    />
    <Stack.Screen 
      name="AddMatch" 
      component={AddMatchScreen}
      options={{ 
        title: 'Nouveau Match',
        headerStyle: { 
          backgroundColor: '#1A73E8',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        headerTintColor: '#fff',
        headerTitleStyle: { 
          fontWeight: '700',
          fontSize: 18,
        }
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
          tabBarActiveTintColor: '#1A73E8',
          tabBarInactiveTintColor: '#8E8E93',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
            height: 85,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen 
          name="Matchs" 
          component={MatchsStack}
          options={{
            tabBarLabel: 'Matchs',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="tennisball" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{
            title: 'Dashboard',
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
            headerShown: true,
            headerStyle: { 
              backgroundColor: '#1A73E8',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5,
            },
            headerTintColor: '#fff',
            headerTitleStyle: { 
              fontWeight: '700',
              fontSize: 18,
            }
          }}
        />
        <Tab.Screen 
          name="Classement" 
          component={ClassementScreen}
          options={{
            title: 'Classement Global',
            tabBarLabel: 'Classement',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="trophy" size={size} color={color} />
            ),
            headerShown: true,
            headerStyle: { 
              backgroundColor: '#1A73E8',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5,
            },
            headerTintColor: '#fff',
            headerTitleStyle: { 
              fontWeight: '700',
              fontSize: 18,
            }
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}