import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '@/screens/HomeScreen'
import ProfileScreen from '@/screens/Profile/ProfileScreen'
import { bargaining, home, inquiries, my_inquiries, my_inquiry_details, my_orders, my_profile, new_inquiry, part_create, part_details, profile_edit, proposal_details, vendor_parts, vendor_proposal, vendor_root } from '@/constants'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { InquiryStackParamList, RootStackParamList } from '@/types/navigation'
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons'
import { useThemeStore } from '@/stores/themeStore'
import EditProfileScreen from '@/screens/Profile/EditProfileScreen'
import MyInquiryScreen from '@/screens/MyInquiries/MyInquiryScreen'
import InquiryFormScreen from '@/screens/MyInquiries/InquiryFormScreen'
import InquiryDetailScreen from '@/screens/MyInquiries/InquiryDetailScreen'
import { useAuthStore } from '@/stores/authStore'
import ProposalListScreen from '@/screens/Proposals/VendorProposalsScreen'
import ProposalDetailsScreen from '@/screens/Proposals/ProposalDetailsScreen'
import UserOrdersScreen from '@/screens/Orders/UserOrdersScreen'
import PartsVendorListScreen from '@/screens/Parts/PartsVendorListScreen'
import PartCreateScreen from '@/screens/Parts/PartCreateScreen'
import PartDetailsScreen from '@/screens/Parts/PartDetailsScreen'

const Tab = createBottomTabNavigator()
const MainStack = createNativeStackNavigator<RootStackParamList>();
const Inquiry = createNativeStackNavigator<InquiryStackParamList>();

function tabBarIcon(name: any): ((props: { focused: boolean; color: string; size: number }) => React.ReactNode) | undefined {
  return props => <MaterialDesignIcons name={name} {...props} />;
}

const InquiryStack = () => (
  <Inquiry.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Inquiry.Screen name={my_inquiries} component={MyInquiryScreen} />
    <Inquiry.Screen name={my_inquiry_details} component={InquiryDetailScreen} />
    <Inquiry.Screen name={new_inquiry} component={InquiryFormScreen} />
  </Inquiry.Navigator>
)

const VendorTabNavigator = () => {
  const { colors } = useThemeStore().theme;
  return (<Tab.Navigator screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: colors.thirdMain,
    tabBarInactiveTintColor: colors.thirdMainLight,
    tabBarIconStyle: { fontSize: 30 },
    tabBarStyle: {
      borderWidth: 0.1,
      borderColor: colors.vendorPrimary,
      borderRadius: 8,
      height: 75,
      backgroundColor: colors.vendorPrimary,
    },
    tabBarHideOnKeyboard: true,
  }}>
    <Tab.Screen name={vendor_proposal} component={ProposalListScreen} options={{ title: 'Proposal', tabBarIcon: tabBarIcon('file-document') }} />
    <Tab.Screen name={vendor_parts} component={PartsVendorListScreen} options={{ title: 'Parts', tabBarIcon: tabBarIcon('wrench') }} />
  </Tab.Navigator>)
}


const TabStack = () => {
  const { colors } = useThemeStore().theme;
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.thirdMain,
      tabBarInactiveTintColor: colors.thirdMainLight,
      tabBarIconStyle: { fontSize: 30 },
      tabBarStyle: {
        borderWidth: 0.1,
        borderColor: colors.primaryLight,
        borderRadius: 8,
        height: 75,
        backgroundColor: colors.primary,
      },
      // tabBarLabelPosition: 'beside-icon',
      tabBarHideOnKeyboard: true,
    }}>
      <Tab.Screen name={home} component={HomeScreen} options={{ tabBarIcon: tabBarIcon('home') }} />
      <Tab.Screen name={inquiries} component={InquiryStack} options={{ tabBarIcon: tabBarIcon('clipboard-list') }} />
      <Tab.Screen name={bargaining} component={ProposalListScreen} options={{ tabBarIcon: tabBarIcon('file-star-four-points') }} />
      <Tab.Screen name={my_orders} component={UserOrdersScreen} options={{ tabBarIcon: tabBarIcon('credit-card-clock') }} />
    </Tab.Navigator>
  )
}

const MainAppStack = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <MainStack.Screen name="Root" component={TabStack} />
    <MainStack.Screen name={my_profile} component={ProfileScreen} />
    <MainStack.Screen name={profile_edit} component={EditProfileScreen} />
    <MainStack.Screen name={vendor_root} component={VendorTabNavigator} />
    <MainStack.Screen name={proposal_details} component={ProposalDetailsScreen} />
    <MainStack.Screen name={part_create} component={PartCreateScreen} />
    <MainStack.Screen name={part_details} component={PartDetailsScreen} />
  </MainStack.Navigator>
)

export default MainAppStack
