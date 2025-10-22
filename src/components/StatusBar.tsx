import React from 'react';
import { StatusBar as Statusbar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '@/stores/themeStore';

export default function StatusBar() {
  const insets = useSafeAreaInsets();
  const { colors, dark } = useThemeStore().theme;

  return (
    <View style={{ height: insets.top }}>
      <Statusbar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
    </View>
  );
}
