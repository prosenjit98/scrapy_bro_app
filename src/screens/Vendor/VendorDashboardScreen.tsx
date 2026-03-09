import React from 'react'
import { View, ScrollView, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import { Card, Text, ActivityIndicator } from 'react-native-paper'
import { LinearGradient } from 'react-native-linear-gradient'
import Icon, { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons'
import { useThemeStore } from '@/stores/themeStore'
import { AppTheme } from '@/theme'
import { useVendorDashboard } from '@/stores/hooks/useDashboard'
import { useAuthStore } from '@/stores/authStore'
import { statusConfig } from '@/constants'



const formatTimeAgo = (dateStr: string) => {
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  } catch {
    return ''
  }
}

const VendorDashboardScreen = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  // @ts-ignore
  const styles = makeStyles(theme.colors)

  const { data, isPending, refetch } = useVendorDashboard()

  const stats = [
    { label: 'Total Products', value: String(data?.stats.totalParts ?? 0), icon: 'package-variant', color: '#3b82f6' },
    { label: 'Active Orders', value: String(data?.stats.activeOrders ?? 0), icon: 'trending-up', color: '#10b981' },
    { label: 'Pending Proposals', value: String(data?.stats.pendingProposals ?? 0), icon: 'file-document-outline', color: '#a855f7' },
    { label: 'Revenue', value: `₹${(data?.stats.totalRevenue ?? 0).toLocaleString()}`, icon: 'currency-inr', color: '#f59e0b' },
  ]

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} />}
    >
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
              <Text style={styles.headerSubtitle}>{user?.fullName || 'Vendor Store'}</Text>
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

      {isPending && !data ? (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
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
            </View>
            <Text style={styles.revenueAmount}>₹{(data?.stats.totalRevenue ?? 0).toLocaleString()}</Text>
            <Text style={styles.revenueSubtext}>From completed orders</Text>
          </LinearGradient>

          {/* My Products */}
          {data?.recentParts && data.recentParts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Products</Text>
              </View>

              <FlatList
                data={data.recentParts}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <Card style={styles.productCard}>
                    <View style={styles.productContent}>
                      <View style={styles.productImage}>
                        <Icon name="package-variant" size={32} color="#9ca3af" />
                      </View>
                      <View style={styles.productInfo}>
                        <Text style={styles.productTitle} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.productPrice}>₹{item.price.toLocaleString()}</Text>
                        <View style={styles.productMeta}>
                          {item.stock !== null && (
                            <View style={styles.metaItem}>
                              <Icon name="cube-outline" size={12} color="#666" />
                              <Text style={styles.metaText}>{item.stock} in stock</Text>
                            </View>
                          )}
                          <Text style={styles.metaDot}>•</Text>
                          <Text style={[styles.metaText, { color: item.isAvailable ? '#10b981' : '#ef4444' }]}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Card>
                )}
              />
            </View>
          )}

          {/* Recent Orders */}
          {data?.recentOrders && data.recentOrders.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              <FlatList
                data={data.recentOrders}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => {
                  const sc = statusConfig(item.status)
                  return (
                    <Card style={styles.activityCard}>
                      <View style={styles.activityContent}>
                        <View style={styles.activityMain}>
                          <Text style={styles.activityTitle}>Order #{item.id}</Text>
                          <Text style={styles.activityDescription}>
                            {item.user?.fullName ?? 'Customer'} — ₹{item.totalPrice?.toLocaleString()}
                          </Text>
                        </View>
                        <Text style={styles.activityTime}>{formatTimeAgo(item.createdAt)}</Text>
                      </View>
                      <View style={styles.statusBadgeContainer}>
                        <View style={[styles.statusBadge, { backgroundColor: `${sc.color}20` }]}>
                          <Text style={[styles.statusBadgeText, { color: sc.color }]}>
                            {sc.label}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  )
                }}
              />
            </View>
          )}

          {!data?.recentOrders?.length && !data?.recentParts?.length && (
            <View style={{ padding: 24, alignItems: 'center' }}>
              <Icon name="store-outline" size={48} color="#9ca3af" />
              <Text style={{ color: '#9ca3af', marginTop: 8, fontSize: 14 }}>
                Start adding products and accepting orders!
              </Text>
            </View>
          )}
        </View>
      )}
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
      justifyContent: 'center',
      alignItems: 'center',
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
