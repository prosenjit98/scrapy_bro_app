import React from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { VERSION_NO } from '@/constants';
import { useAppTheme } from '../theme';

export default function Splash() {
  const { colors } = useAppTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', position: 'relative', justifyContent: 'center', backgroundColor: colors.background }}>
      <StatusBar backgroundColor={colors.background} barStyle="light-content" />
      <View style={styles.container}>
        <Image source={require('@/assets/images/splash_logo.png')} style={styles.image} />
      </View>
      <Text style={{ color: colors.secondary, position: 'absolute', bottom: 12, fontSize: 10 }}>Version {VERSION_NO}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  image: { marginVertical: -10, maxWidth: '40%', width: 170, height: undefined, aspectRatio: 1, resizeMode: 'contain' },
});