import useLoaderState from '@/stores/loaderState';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const Loader = () => {
  const loader = useLoaderState(state => state.loader);

  if (loader)
    return (
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="green" animating={loader} />
      </View>
    );
  return <></>;
};

export default Loader;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill, // Overlay the entire screen
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000000,
  },
});
