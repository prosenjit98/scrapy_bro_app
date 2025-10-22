import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import MyLayout from '@/components/MyLayout';

export default function HomeScreen() {
  const logout = useAuthStore((s) => s.logout);
  const { toggleTheme, mode } = useThemeStore();

  return (
    <MyLayout hasProfileLink={true}>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="headlineMedium">Welcome Home!</Text>
        <Button mode="contained" onPress={logout} style={{ marginTop: 20 }}>
          Logout
        </Button>
        <Button onPress={toggleTheme} style={{ marginTop: 20 }}>
          Switch to {mode === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
      </View>
    </MyLayout>

  );
}
