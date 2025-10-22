import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '@/screens/HomeScreen'
import ProfileScreen from '@/screens/Profile/ProfileScreen'
import { home, my_orders, my_profile, profile_edit } from '@/constants'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootStackParamList } from '@/types/navigation'
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons'
import { useThemeStore } from '@/stores/themeStore'
import EditProfileScreen from '@/screens/Profile/EditProfileScreen'

const Tab = createBottomTabNavigator()
const MainStack = createNativeStackNavigator<RootStackParamList>();

function tabBarIcon(name: any): ((props: { focused: boolean; color: string; size: number }) => React.ReactNode) | undefined {
  return props => <MaterialDesignIcons name={name} {...props} />;
}

const TabStack = () => {
  const { colors } = useThemeStore().theme;
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: {
        borderWidth: 0.1,
        borderColor: colors.primaryLight,
        borderRadius: 8,
        height: 65,
        backgroundColor: colors.background,
      },
      // tabBarLabelPosition: 'beside-icon',
      tabBarHideOnKeyboard: true,
    }}>
      <Tab.Screen name={home} component={HomeScreen} options={{ tabBarIcon: tabBarIcon('home') }} />
      <Tab.Screen name={my_orders} component={HomeScreen} options={{ tabBarIcon: tabBarIcon('book') }} />
    </Tab.Navigator>
  )
}

const MainAppStack = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <MainStack.Screen name="Root" component={TabStack} />
    <MainStack.Screen name={my_profile} component={ProfileScreen} />
    <MainStack.Screen name={profile_edit} component={EditProfileScreen} />
  </MainStack.Navigator>
)

export default MainAppStack
