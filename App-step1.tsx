import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';

// Import ONLY original screens without shadcn
import MatchsScreen from './src/screens/MatchsScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ClassementScreen from './src/screens/ClassementScreen';
import { theme } from './src/themes';

const Tab = createBottomTabNavigator();

// Version étape 1: Navigation de base avec écrans originaux
export default function AppStep1() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={theme.colors.primary[500]} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string;

            if (route.name === 'Matchs') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Dashboard') {
              iconName = focused ? 'analytics' : 'analytics-outline';
            } else if (route.name === 'Classement') {
              iconName = focused ? 'trophy' : 'trophy-outline';
            } else {
              iconName = 'ellipse-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary[500],
          tabBarInactiveTintColor: theme.colors.neutral[500],
          headerShown: true,
          headerStyle: { 
            backgroundColor: theme.colors.primary[500],
          },
          headerTintColor: theme.colors.text.inverse,
          headerTitleStyle: { fontWeight: '600', fontSize: 18 },
          tabBarStyle: {
            backgroundColor: theme.colors.background.card,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.primary,
            paddingTop: theme.spacing.xs,
            paddingBottom: theme.spacing.sm,
            height: 60,
          },
        })}
      >
        <Tab.Screen 
          name="Matchs" 
          component={MatchsScreen}
          options={{
            title: 'Mes Matchs',
            tabBarLabel: 'Matchs'
          }}
        />
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{
            title: 'Mon Dashboard',
            tabBarLabel: 'Dashboard',
          }}
        />
        <Tab.Screen 
          name="Classement" 
          component={ClassementScreen}
          options={{
            title: 'Classement Global',
            tabBarLabel: 'Classement',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}