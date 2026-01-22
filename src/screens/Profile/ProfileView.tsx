import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import { useThemeStore } from '@/stores/themeStore'
import { AppTheme } from '@/theme'
import { useProfile } from '@/stores/hooks/useProfile'
import { useAuthStore } from '@/stores/authStore'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '@/types/navigation'
import Icon, { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons'
import { profile_edit } from '@/constants'
import MyNewHeader from '@/components/MyNewHeader'

const ProfileView = () => {
  const theme = useThemeStore().theme
  const { colors } = theme
  //@ts-ignore
  const styles = makeStyles(colors)
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Root'>>()
  const { profileQuery } = useProfile()
  const { logout } = useAuthStore()
  const { data: profile } = profileQuery()

  const menuItems = [
    { id: 1, label: 'Edit Profile', icon: 'pencil', action: () => navigation.navigate(profile_edit, { type: 'personal_info' }) },
    { id: 2, label: 'My Orders', icon: 'shopping-bag', action: () => navigation.navigate('UserOrders' as any) },
    { id: 3, label: 'My Inquiries', icon: 'comment-question', action: () => navigation.navigate('MyInquiry' as any) },
    { id: 4, label: 'My Parts', icon: 'wrench', action: () => navigation.navigate('PartsList' as any) },
    { id: 5, label: 'Settings', icon: 'cog', action: () => navigation.navigate('Settings' as any) },
    { id: 6, label: 'Help & Support', icon: 'help-circle', action: () => navigation.navigate('Support' as any) },
  ]

  const handleLogout = () => {
    logout()
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' as any }],
    })
  }

  const getInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U'
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <MyNewHeader title='Profile' subtitle='View and manage your profile' withBackButton={true} />

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitial(profile?.fullName)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{profile?.fullName || 'User'}</Text>
            <Text style={styles.profileEmail}>{profile?.email}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {profile?.ordersCount || 0}
            </Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={[styles.statItem, styles.statItemBorder]}>
            <Text style={styles.statValue}>
              {profile?.activeCount || 0}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {profile?.completedCount || 0}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>

      {/* Personal Details Section */}
      {(profile?.address || profile?.dateOfBirth || profile?.phoneNumber || profile?.pan || profile?.gst) && (
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <View style={styles.detailsCard}>
            {profile?.phoneNumber && (
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Icon name="phone" size={18} color="#4f46e5" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>Phone Number</Text>
                  <Text style={styles.detailValue}>{profile?.phoneNumber}</Text>
                </View>
              </View>
            )}

            {profile?.address && (
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Icon name="map-marker" size={18} color="#4f46e5" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>Address</Text>
                  <Text style={styles.detailValue}>{profile?.address}</Text>
                </View>
              </View>
            )}

            {profile?.dateOfBirth && (
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Icon name="calendar" size={18} color="#4f46e5" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>Date of Birth</Text>
                  <Text style={styles.detailValue}>
                    {new Date(profile?.dateOfBirth).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}

            {profile?.pan && (
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Icon name="card-account-details" size={18} color="#4f46e5" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>PAN</Text>
                  <Text style={styles.detailValue}>{profile?.pan}</Text>
                </View>
              </View>
            )}

            {profile?.gst && (
              <View style={[styles.detailRow, styles.detailRowLast]}>
                <View style={styles.detailIconContainer}>
                  <Icon name="receipt" size={18} color="#4f46e5" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>GST</Text>
                  <Text style={styles.detailValue}>{profile?.gst}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Favorite Vendors Section */}
      {profile?.favoriteVendors && profile?.favoriteVendors?.length > 0 && (
        <View style={styles.vendorSection}>
          <Text style={styles.sectionTitle}>Favorite Vendors</Text>
          {profile?.favoriteVendors?.map((vendor: any, index: number) => (
            <View key={index} style={styles.vendorCard}>
              <View style={styles.vendorAvatar}>
                <Text style={styles.vendorAvatarText}>
                  {getInitial(vendor?.name)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.vendorName}>{vendor?.name}</Text>
                <View style={styles.ratingContainer}>
                  <Icon name="star" size={12} color="#fbbf24" />
                  <Text style={styles.ratingText}>
                    {vendor?.rating || 0} ({vendor?.reviewCount || 0} reviews)
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.visitButton}>
                <Text style={styles.visitButtonText}>Visit</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.action}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconContainer}>
                <Icon name={item.icon as MaterialDesignIconsIconName} size={20} color={colors.primary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <View style={styles.menuItemLeft}>
            <View style={styles.logoutIconContainer}>
              <Icon name="logout" size={20} color="#dc2626" />
            </View>
            <Text style={styles.logoutLabel}>Logout</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#fecaca" />
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Scrapy v1.0.0</Text>
        <Text style={styles.appCopyright}>© 2026 Scrapy. All rights reserved.</Text>
      </View>
    </View>
  )
}

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    profileCard: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 16,
      marginTop: -30,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    avatarContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#4f46e5',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      fontSize: 24,
      fontWeight: '700',
      color: '#fff',
    },
    profileName: {
      fontSize: 18,
      fontWeight: '700',
      color: '#111',
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 13,
      color: '#666',
    },
    statsContainer: {
      flexDirection: 'row',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#f3f4f6',
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statItemBorder: {
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: '#f3f4f6',
    },
    statValue: {
      fontSize: 20,
      fontWeight: '700',
      color: '#4f46e5',
    },
    statLabel: {
      fontSize: 12,
      color: '#666',
      marginTop: 4,
    },
    detailsSection: {
      paddingHorizontal: 16,
      marginTop: 20,
    },
    detailsCard: {
      backgroundColor: '#fff',
      borderRadius: 14,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
    },
    detailRowLast: {
      borderBottomWidth: 0,
    },
    detailIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: '#eef2ff',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    detailLabel: {
      fontSize: 12,
      color: '#666',
      marginBottom: 3,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '600',
      color: '#111',
    },
    vendorSection: {
      paddingHorizontal: 16,
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111',
      marginBottom: 12,
    },
    vendorCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 14,
      padding: 12,
      marginBottom: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    vendorAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#3b82f6',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    vendorAvatarText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#fff',
    },
    vendorName: {
      fontSize: 14,
      fontWeight: '600',
      color: '#111',
      marginBottom: 4,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: 12,
      color: '#666',
      marginLeft: 4,
    },
    visitButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: '#eef2ff',
      borderRadius: 8,
    },
    visitButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#4f46e5',
    },
    menuSection: {
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 16,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 8,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: '#f3f4f6',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    menuLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: '#111',
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fef2f2',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginTop: 8,
    },
    logoutIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: '#fee2e2',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    logoutLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: '#dc2626',
    },
    appInfo: {
      alignItems: 'center',
      paddingBottom: 24,
    },
    appVersion: {
      fontSize: 12,
      color: '#888',
      marginBottom: 4,
    },
    appCopyright: {
      fontSize: 11,
      color: '#aaa',
    },
  })

export default ProfileView
