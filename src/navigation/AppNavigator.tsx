import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { ChatScreen } from '../screens/ChatScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RecommendationScreen } from '../screens/RecommendationScreen';
import { StylistsScreen } from '../screens/StylistsScreen';
import { WardrobeScreen } from '../screens/WardrobeScreen';
import {
  MainTabParamList,
  RootStackParamList,
} from '../types';
import { colors } from '../ui';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.canvas,
    card: colors.canvas,
    border: colors.line,
    primary: colors.ink,
    text: colors.ink,
  },
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Wardrobe: '▦',
    Stylists: '✦',
    Chat: '◌',
  };
  return (
    <View style={[styles.icon, focused && styles.iconActive]}>
      <Text style={[styles.iconText, focused && styles.iconTextActive]}>
        {icons[name]}
      </Text>
    </View>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: '#8A8F89',
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: [styles.tabBar, { bottom: insets.bottom + 8 }],
        tabBarItemStyle: styles.tabItem,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} name={route.name} />
        ),
      })}
    >
      <Tab.Screen component={WardrobeScreen} name="Wardrobe" />
      <Tab.Screen component={StylistsScreen} name="Stylists" />
      <Tab.Screen
        component={ChatScreen}
        name="Chat"
        options={{ tabBarStyle: { display: 'none' } }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isReady, isSignedIn } = useApp();

  if (!isReady) {
    return (
      <View style={styles.splash}>
        <View style={styles.splashMark}>
          <Text style={styles.splashMarkText}>D</Text>
        </View>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!isSignedIn) {
    return (
      <NavigationContainer theme={DarkTheme}>
        <LoginScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer theme={lightTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={MainTabs} name="Main" />
        <Stack.Screen
          component={RecommendationScreen}
          name="Recommendation"
          options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  splashMark: {
    width: 64,
    height: 64,
    borderRadius: 21,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashMarkText: { color: colors.ink, fontSize: 32, fontWeight: '900' },
  tabBar: {
    position: 'absolute',
    height: 76,
    paddingTop: 7,
    paddingBottom: 7,
    marginHorizontal: 14,
    borderTopWidth: 0,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#1A1C1A',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  tabItem: { paddingVertical: 1 },
  tabLabel: { fontSize: 10, fontWeight: '800', marginTop: 2 },
  icon: {
    width: 31,
    height: 31,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: { backgroundColor: colors.accent },
  iconText: { color: '#8A8F89', fontSize: 18, fontWeight: '900' },
  iconTextActive: { color: colors.ink },
});
