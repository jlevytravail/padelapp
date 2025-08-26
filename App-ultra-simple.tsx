import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

// Écrans ultra-simples sans dépendances complexes
const SimpleMatchsScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>📋 Mes Matchs</Text>
    <Text style={styles.text}>Liste des matchs (version simplifiée)</Text>
  </View>
);

const SimpleDashboardScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>📊 Dashboard</Text>
    <Text style={styles.text}>Statistiques (version simplifiée)</Text>
  </View>
);

const SimpleClassementScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>🏆 Classement</Text>
    <Text style={styles.text}>Classement global (version simplifiée)</Text>
  </View>
);

// App ultra-simple pour tester la navigation de base
export default function AppUltraSimple() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
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
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#999',
          headerShown: true,
          headerStyle: { 
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
        })}
      >
        <Tab.Screen 
          name="Matchs" 
          component={SimpleMatchsScreen}
          options={{ title: 'Mes Matchs' }}
        />
        <Tab.Screen 
          name="Dashboard" 
          component={SimpleDashboardScreen}
          options={{ title: 'Dashboard' }}
        />
        <Tab.Screen 
          name="Classement" 
          component={SimpleClassementScreen}
          options={{ title: 'Classement' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});