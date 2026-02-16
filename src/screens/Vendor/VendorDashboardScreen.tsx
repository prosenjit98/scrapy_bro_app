import React from 'react'
import { View, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Card, Text, Divider } from 'react-native-paper'
import { LinearGradient } from 'react-native-linear-gradient'
import Icon, { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons'
import { useThemeStore } from '@/stores/themeStore'
import { AppTheme } from '@/theme'



const VendorDashboardScreen = () => {
  const { theme } = useThemeStore()
  // @ts-ignore
  const styles = makeStyles(theme.colors)

  const stats = [
    { label: 'Total Products', value: '24', icon: 'package-variant', color: '#3b82f6' },
    { label: 'Active Orders', value: '8', icon: 'trending-up', color: '#10b981' },
    { label: 'Inquiries', value: '12', icon: 'message-square', color: '#a855f7' },
    { label: 'Rating', value: '4.5', icon: 'star', color: '#f59e0b' },
  ]

  const products = [
    { id: 1, title: 'iPhone 12 Pro', price: 35000, views: 245, stock: true },
    { id: 2, title: 'Dell XPS 15', price: 89900, views: 156, stock: true },
    { id: 3, title: 'Samsung Galaxy S21', price: 42000, views: 312, stock: true },
  ]

  const activities = [
    { id: 1, title: 'New Order', description: 'iPhone 12 Pro - ₹35,000', time: '2h ago', status: 'Confirmed', statusColor: '#10b981' },
    { id: 2, title: 'New Inquiry', description: 'Dell XPS 15 - Question about warranty', time: '5h ago', status: 'Pending Response', statusColor: '#3b82f6' },
  ]

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#10b981', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Welcome back!</Text>
              <Text style={styles.headerSubtitle}>Vendor Store</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Icon name="bell" size={24} color="#fff" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          {/* Verification Status */}
          <View style={styles.verificationCard}>
            <View style={styles.verificationContent}>
              <View style={styles.verificationIcon}>
                <Icon name="check-circle" size={18} color="#10b981" />
              </View>
              <Text style={styles.verificationText}>Verified Vendor</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <Card key={stat.label} style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                  <Icon name={stat.icon as MaterialDesignIconsIconName} size={20} color="#fff" />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Revenue Card */}
        <LinearGradient
          colors={['#4f46e5', '#9333ea']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.revenueCard}
        >
          <View style={styles.revenueTop}>
            <View style={styles.revenueLabelContainer}>
              <Icon name="currency-inr" size={16} color="#fff" />
              <Text style={styles.revenueLabel}>Total Revenue</Text>
            </View>
            <View style={styles.revenueMonth}>
              <Text style={styles.revenueMonthText}>This Month</Text>
            </View>
          </View>
          <Text style={styles.revenueAmount}>₹45,680</Text>
          <Text style={styles.revenueSubtext}>+12% from last month</Text>
        </LinearGradient>

        {/* My Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Products</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Card style={styles.productCard}>
                <View style={styles.productContent}>
                  <View style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.productPrice}>₹{item.price.toLocaleString()}</Text>
                    <View style={styles.productMeta}>
                      <View style={styles.metaItem}>
                        <Icon name="eye" size={12} color="#666" />
                        <Text style={styles.metaText}>{item.views} views</Text>
                      </View>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={[styles.metaText, { color: '#10b981' }]}>In Stock</Text>
                    </View>
                  </View>
                </View>
              </Card>
            )}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <FlatList
            data={activities}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Card style={styles.activityCard}>
                <View style={styles.activityContent}>
                  <View style={styles.activityMain}>
                    <Text style={styles.activityTitle}>{item.title}</Text>
                    <Text style={styles.activityDescription}>{item.description}</Text>
                  </View>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
                <View style={styles.statusBadgeContainer}>
                  <View style={[styles.statusBadge, { backgroundColor: `${item.statusColor}20` }]}>
                    <Text style={[styles.statusBadgeText, { color: item.statusColor }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              </Card>
            )}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const makeStyles = (colors: AppTheme['colors']) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 40,
      paddingBottom: 24,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerContent: {
      gap: 12,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.8)',
    },
    notificationButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationBadge: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#ef4444',
      position: 'absolute',
      top: 8,
      right: 8,
    },
    verificationCard: {
      backgroundColor: '#ffffff',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      alignSelf: 'flex-start',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    verificationContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    verificationIcon: {
      width: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    verificationText: {
      color: '#059669',
      fontSize: 14,
      fontWeight: '600',
    },
    content: {
      padding: 16,
      gap: 16,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    statCard: {
      width: '48%',
      borderRadius: 16,
      padding: 16,
      elevation: 1,
    },
    statContent: {
      gap: 8,
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    statLabel: {
      fontSize: 11,
      color: '#666',
      fontWeight: '500',
    },
    revenueCard: {
      borderRadius: 16,
      padding: 20,
      elevation: 3,
    },
    revenueTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    revenueLabelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    revenueLabel: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: 13,
    },
    revenueMonth: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    revenueMonthText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '500',
    },
    revenueAmount: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 4,
    },
    revenueSubtext: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 13,
    },
    section: {
      gap: 12,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    viewAllButton: {
      fontSize: 13,
      color: '#10b981',
      fontWeight: '600',
    },
    productCard: {
      borderRadius: 12,
      marginBottom: 12,
      padding: 12,
      elevation: 1,
    },
    productContent: {
      flexDirection: 'row',
      gap: 12,
    },
    productImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      backgroundColor: '#f3f4f6',
    },
    productInfo: {
      flex: 1,
      justifyContent: 'space-between',
    },
    productTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    productPrice: {
      fontSize: 14,
      fontWeight: '700',
      color: '#10b981',
      marginBottom: 8,
    },
    productMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontSize: 12,
      color: '#666',
    },
    metaDot: {
      fontSize: 12,
      color: '#666',
    },
    activityCard: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      elevation: 1,
    },
    activityContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    activityMain: {
      flex: 1,
      gap: 4,
    },
    activityTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    activityDescription: {
      fontSize: 12,
      color: '#666',
    },
    activityTime: {
      fontSize: 11,
      color: '#999',
    },
    statusBadgeContainer: {
      alignItems: 'flex-start',
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 6,
    },
    statusBadgeText: {
      fontSize: 11,
      fontWeight: '600',
    },
  })
}

export default VendorDashboardScreen
