import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAuthStore } from './src/store/authStore';
import { useDemoAuthStore, DEMO_STUDENT } from './src/store/demoAuthStore';
import { useStudentStore } from './src/store/studentStore';
import { COLORS } from './src/constants';

// Auth Screens
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';

// Student Screens
import { StudentDashboardScreen } from './src/screens/student/StudentDashboardScreen';
import { StudentJourneyScreen } from './src/screens/student/StudentJourneyScreen';
import { WorkLogSubmissionScreen } from './src/screens/student/WorkLogSubmissionScreen';
import { HonorCodeScreen } from './src/screens/student/HonorCodeScreen';
import { LegalTemplatesScreen } from './src/screens/student/LegalTemplatesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Student Tab Navigator
function StudentTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text.tertiary,
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={StudentDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Journey"
        component={StudentJourneyScreen}
        options={{
          tabBarLabel: 'Roadmap',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🗺️</Text>,
        }}
      />
      <Tab.Screen
        name="WorkLogSubmission"
        component={WorkLogSubmissionScreen}
        options={{
          tabBarLabel: 'Log',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📝</Text>,
        }}
      />
      <Tab.Screen
        name="More"
        component={LegalTemplatesScreen}
        options={{
          tabBarLabel: 'Resources',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📚</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

// Student Stack Navigator (for modals and full-screen)
function StudentStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="StudentTabs" component={StudentTabs} />
      <Stack.Screen 
        name="HonorCode" 
        component={HonorCodeScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}

// Main App
export default function App() {
  const [isReady, setIsReady] = useState(false);
  
  // Check both real auth and demo auth
  const realIsAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const realUserRole = useAuthStore((state) => state.userRole);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  
  const demoIsAuthenticated = useDemoAuthStore((state) => state.isAuthenticated);
  const demoUserRole = useDemoAuthStore((state) => state.userRole);
  const isDemoMode = useDemoAuthStore((state) => state.isDemoMode);
  
  // Use demo auth if in demo mode, otherwise use real auth
  const isAuthenticated = isDemoMode && demoIsAuthenticated ? true : realIsAuthenticated;
  const userRole = isDemoMode && demoIsAuthenticated ? demoUserRole : realUserRole;
  
  // Load demo student data when in demo mode
  const setDemoStudent = useStudentStore((state) => state.currentStudent);

  useEffect(() => {
    async function initialize() {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsReady(true);
      }
    }

    initialize();
  }, []);
  
  // Set demo student data if in demo mode
  useEffect(() => {
    if (isDemoMode && demoIsAuthenticated && !setDemoStudent) {
      useStudentStore.setState({ currentStudent: DEMO_STUDENT });
    }
  }, [isDemoMode, demoIsAuthenticated]);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            {!isAuthenticated ? (
              // Auth Flow
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
              </>
            ) : (
              // Authenticated Flow
              <>
                {userRole === 'student' && (
                  <Stack.Screen name="StudentApp" component={StudentStack} />
                )}
                {userRole === 'instructor' && (
                  <Stack.Screen 
                    name="InstructorDashboard" 
                    component={View} // Placeholder - Coming in Phase 2
                  />
                )}
                {userRole === 'admin' && (
                  <Stack.Screen 
                    name="AdminDashboard" 
                    component={View} // Placeholder - Coming in Phase 3
                  />
                )}
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.light,
  },
});
