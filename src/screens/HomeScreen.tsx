import React from 'react';
import { View } from 'react-native';
import { Button, FAB, Text } from 'react-native-paper';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import MyLayout from '@/components/MyLayout';
import { vendor_root } from '@/constants';

export default function HomeScreen({ navigation }: any) {
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
      <FAB
        icon="fast-forward"
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
        }}
        onPress={() => navigation.navigate(vendor_root)}
      />
    </MyLayout>

  );
}
