import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import MatchsScreen from './src/screens/MatchsScreen';
import DashboardScreenShadcn from './src/screens/DashboardScreenShadcn';
import ClassementScreenShadcn from './src/screens/ClassementScreenShadcn';
import AddMatchScreenShadcn from './src/screens/AddMatchScreenShadcn';
import { theme } from './src/themes';

// Import du Dock shadcn
import { Dock, DockItem } from './src/components/shadcn';

const Stack = createStackNavigator();

type ScreenName = 'Dashboard' | 'Matchs' | 'Classement' | 'AddMatch';

export default function AppShadcn() {
  const [activeScreen, setActiveScreen] = useState<ScreenName>('Dashboard');

  // Configuration des items du dock
  const dockItems: DockItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'analytics',
      isActive: activeScreen === 'Dashboard',
      onPress: () => setActiveScreen('Dashboard'),
    },
    {
      id: 'matches',
      label: 'Matchs',
      icon: 'list',
      isActive: activeScreen === 'Matchs',
      onPress: () => setActiveScreen('Matchs'),
      badge: 3, // Nombre de nouveaux matchs
    },
    {
      id: 'add',
      label: 'Nouveau',
      icon: 'add-circle',
      isActive: activeScreen === 'AddMatch',
      onPress: () => setActiveScreen('AddMatch'),
    },
    {
      id: 'ranking',
      label: 'Classement',
      icon: 'trophy',
      isActive: activeScreen === 'Classement',
      onPress: () => setActiveScreen('Classement'),
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: 'person-circle',
      isActive: false,
      onPress: () => {
        // Navigation vers le profil (à implémenter)
        console.log('Navigation vers profil');
      },
    },
  ];

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Dashboard':
        return <DashboardScreenShadcn />;
      case 'Matchs':
        return <MatchsScreen />;
      case 'Classement':
        return <ClassementScreenShadcn />;
      case 'AddMatch':
        return <AddMatchScreenShadcn />;
      default:
        return <DashboardScreenShadcn />;
    }
  };

  const getScreenTitle = () => {
    switch (activeScreen) {
      case 'Dashboard':
        return '🎾 Mon Dashboard';
      case 'Matchs':
        return '📋 Mes Matchs';
      case 'Classement':
        return '🏆 Classement Global';
      case 'AddMatch':
        return '➕ Nouveau Match';
      default:
        return 'Padel MVP';
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor={theme.colors.primary[500]} />
        
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
            name="Main"
            options={{ 
              title: getScreenTitle(),
              headerShown: true,
            }}
          >
            {() => (
              <View style={styles.container}>
                <SafeAreaView style={styles.content} edges={['left', 'right']}>
                  {renderScreen()}
                </SafeAreaView>
                
                {/* Dock de navigation moderne */}
                <Dock
                  items={dockItems}
                  variant="floating"
                  position="bottom"
                  showLabels={false}
                  style={styles.dock}
                />
              </View>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Version alternative avec Dock magnétique
export function AppShadcnMagnetic() {
  const [activeScreen, setActiveScreen] = useState<ScreenName>('Dashboard');

  const dockItems: DockItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'analytics',
      isActive: activeScreen === 'Dashboard',
      onPress: () => setActiveScreen('Dashboard'),
    },
    {
      id: 'matches',
      label: 'Matchs',
      icon: 'list',
      isActive: activeScreen === 'Matchs',
      onPress: () => setActiveScreen('Matchs'),
      badge: 3,
    },
    {
      id: 'add',
      label: 'Nouveau',
      icon: 'add-circle',
      isActive: activeScreen === 'AddMatch',
      onPress: () => setActiveScreen('AddMatch'),
    },
    {
      id: 'ranking',
      label: 'Classement',
      icon: 'trophy',
      isActive: activeScreen === 'Classement',
      onPress: () => setActiveScreen('Classement'),
    },
  ];

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Dashboard':
        return <DashboardScreenShadcn />;
      case 'Matchs':
        return <MatchsScreen />;
      case 'Classement':
        return <ClassementScreenShadcn />;
      case 'AddMatch':
        return <AddMatchScreenShadcn />;
      default:
        return <DashboardScreenShadcn />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.magneticContainer}>
        <StatusBar style="light" backgroundColor={theme.colors.primary[500]} />
        
        <View style={styles.magneticContent}>
          {renderScreen()}
        </View>
        
        {/* Version magnétique du Dock */}
        <Dock
          items={dockItems}
          variant="floating"
          position="bottom"
          showLabels={false}
          style={styles.magneticDock}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  content: {
    flex: 1,
  },
  dock: {
    // Le dock se positionnera automatiquement
  },
  magneticContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  magneticContent: {
    flex: 1,
    paddingBottom: 100, // Espace pour le dock magnétique
  },
  magneticDock: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});