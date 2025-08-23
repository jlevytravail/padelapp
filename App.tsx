import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';

import MatchsScreen from './src/screens/MatchsScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ClassementScreen from './src/screens/ClassementScreen';
import AddMatchScreen from './src/screens/AddMatchScreen';
import { theme } from './src/themes';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MatchsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { 
        backgroundColor: theme.colors.primary[500],
        shadowColor: theme.colors.neutral[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
      },
      headerTintColor: theme.colors.text.inverse,
      headerTitleStyle: { 
        fontWeight: '600',
        fontSize: 18,
      },
      headerBackTitleVisible: false,
    }}
  >
    <Stack.Screen 
      name="MatchsList" 
      component={MatchsScreen}
      options={{ 
        title: 'Mes Matchs',
        headerLeft: () => (
          <Icon 
            name="tennisball" 
            size={24} 
            color={theme.colors.text.inverse} 
            style={{ marginLeft: 16 }}
          />
        ),
      }} 
    />
    <Stack.Screen 
      name="AddMatch" 
      component={AddMatchScreen}
      options={{ 
        title: 'Nouveau Match',
        headerRight: () => (
          <Icon 
            name="add-circle-outline" 
            size={24} 
            color={theme.colors.text.inverse} 
            style={{ marginRight: 16 }}
          />
        ),
      }} 
    />
  </Stack.Navigator>
);

export default function App() {
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
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.background.card,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.primary,
            paddingTop: theme.spacing.xs,
            paddingBottom: theme.spacing.sm,
            height: theme.spacing.component.height.tabBar,
            ...theme.shadows.ios.sm,
            elevation: theme.shadows.android.sm,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: -4,
          },
          tabBarItemStyle: {
            paddingVertical: theme.spacing.xs,
          },
        })}
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
            title: 'Mon Dashboard',
            tabBarLabel: 'Dashboard',
            headerShown: true,
            headerStyle: { 
              backgroundColor: theme.colors.primary[500],
              shadowColor: theme.colors.neutral[900],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 4,
            },
            headerTintColor: theme.colors.text.inverse,
            headerTitleStyle: { fontWeight: '600', fontSize: 18 },
            headerLeft: () => (
              <Icon 
                name="bar-chart" 
                size={24} 
                color={theme.colors.text.inverse} 
                style={{ marginLeft: 16 }}
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Classement" 
          component={ClassementScreen}
          options={{
            title: 'Classement Global',
            tabBarLabel: 'Classement',
            headerShown: true,
            headerStyle: { 
              backgroundColor: theme.colors.primary[500],
              shadowColor: theme.colors.neutral[900],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 4,
            },
            headerTintColor: theme.colors.text.inverse,
            headerTitleStyle: { fontWeight: '600', fontSize: 18 },
            headerLeft: () => (
              <Icon 
                name="podium" 
                size={24} 
                color={theme.colors.text.inverse} 
                style={{ marginLeft: 16 }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}