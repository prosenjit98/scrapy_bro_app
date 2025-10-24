import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from '@/stores/themeStore';
import LandingScreen from './screens/LandingScreen';
import { AppSnackbar } from './components/AppSnackbar';
import Loader from './components/Loader';

const queryClient = new QueryClient();

export default function AppProvider() {
  const { theme } = useThemeStore();

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <LandingScreen />
          <AppSnackbar />
          <Loader />
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}
