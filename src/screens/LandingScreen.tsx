import React, { useEffect } from 'react';
import Splash from '@/components/Splash';
import { useAuthStore } from '@/stores/authStore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingStack from '@/navigation/OnboardingStack';
import MainAppStack from '@/navigation/MainAppStack';
import AuthStack from '@/navigation/AuthStack';

const LandingScreen = () => {
  const { token, isFirstLaunch, hydrate, isLoading, checkFirstLaunch } = useAuthStore()
  const [loading, setLoading] = React.useState(true);
  const RootStack = createNativeStackNavigator()

  useEffect(() => {
    const t = setTimeout(() => {
      showNextPage();
    }, 3000);
    hydrate();
    checkFirstLaunch()

    return () => {
      clearTimeout(t);
    };
  }, []);

  const showNextPage = () => {
    setLoading(false);
  };

  if (isLoading || loading) {
    return <Splash />;
  }


  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isFirstLaunch ? (
        <RootStack.Screen name="OnboardingStack" component={OnboardingStack} />
      ) : token ? (
        <RootStack.Screen name="MainAppStack" component={MainAppStack} />
      ) : (
        <RootStack.Screen name="AuthStack" component={AuthStack} />
      )}
    </RootStack.Navigator>
  )
};

export default LandingScreen;