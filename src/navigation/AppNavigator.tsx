import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import {
  BookingsScreen,
  ChatScreen,
  HomeScreen,
  ProfileScreen,
  StoreScreen,
} from '../screens/main/MainTabScreens';
import type { MainTabParamList } from '../types';
import { colors, typography } from '../utils/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text
        style={{
          fontFamily: 'Nunito_800ExtraBold',
          fontSize: typography.sizes.xs,
          color: focused ? colors.primary : colors.muted,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </>
  );
}

export function CustomerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          paddingBottom: 8,
          height: 72,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📅" label="Bookings" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Store"
        component={StoreScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🛍️" label="Store" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="💬" label="Chat" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return <CustomerTabNavigator />;
}
