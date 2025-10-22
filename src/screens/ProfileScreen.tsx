import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import MyHeader from '@/components/MyHeader';

export default function ProfileScreen() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <>
      <MyHeader withBackButton={true} hasProfileLink={true} moduleName={'Profile'} />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="headlineMedium">Welcome Profile!</Text>
      </View>
    </>
  );
}
