import React, { useState } from 'react'
import { FlatList, TouchableOpacity, Text, View, ScrollView, StyleSheet } from 'react-native'
import { Card } from 'react-native-paper'
import { NoData } from '@/components/NoData'
import { useVendorBargains } from '@/stores/hooks/useBargains'
import { useAuthStore } from '@/stores/authStore'
import SkeletonBox from '@/components/SkeletonBox'
import BargainingCard from '@/components/Proposal/BargainingCard'
import MyNewHeader from '@/components/MyNewHeader'
import { useThemeStore } from '@/stores/themeStore'
import { AppTheme } from '@/theme'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '@/types/navigation'
import { bargain_details } from '@/constants'

const VendorBargainsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Root'>>()
  const { user } = useAuthStore()
  const { colors } = useThemeStore().theme
  //@ts-ignore
  const styles = makeStyles(colors)
  const { data, isLoading, refetch } = useVendorBargains(user?.id!, [{ key: 'withComments', value: '1' }])

  const filters = ['All', 'Pending', 'Accepted', 'Rejected']
  const [filterStatus, setFilterStatus] = useState('All')

  const getStatusLabel = (isSelfAccepted: boolean | null) => {
    if (isSelfAccepted === null || isSelfAccepted === undefined) return 'Pending'
    return isSelfAccepted ? 'Accepted' : 'Rejected'
  }

  const filteredData = filterStatus === 'All'
    ? data
    : data?.filter(o => getStatusLabel(o.isSelfAccepted) === filterStatus)

  if (isLoading) {
    return (
      <View style={styles.container}>
        <MyNewHeader title="Buy Requests" subtitle="Bargains from users on your parts" />
        {[1, 2, 3].map((i) => (
          <Card key={i} style={{ margin: 8, padding: 16 }}>
            <SkeletonBox height={20} width="60%" />
            <SkeletonBox height={10} width="90%" />
            <SkeletonBox height={10} width="90%" />
          </Card>
        ))}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MyNewHeader title="Buy Requests" withBackButton={true} subtitle="Bargains from users on your parts" vendor={true} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContentContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              filterStatus === filter && styles.filterButtonActive,
            ]}
            onPress={() => setFilterStatus(filter)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterStatus === filter && styles.filterButtonTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        refreshing={isLoading}
        onRefresh={refetch}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={
          <NoData
            title="No buy requests yet"
            description="No users have sent any bargains on your parts yet."
            onRetry={refetch}
            buttonLabel="Refresh"
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate(bargain_details, { bargainId: item.id })}>
            <BargainingCard item={item} />
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

export default VendorBargainsScreen

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    filterContainer: {
      backgroundColor: '#fff',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
      marginHorizontal: 16,
      borderRadius: 8,
      marginTop: -25,
      flexGrow: 0,
    },
    filterContentContainer: {
      paddingHorizontal: 16,
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: '#f3f4f6',
      marginRight: 8,
    },
    filterButtonActive: {
      backgroundColor: '#4f46e5',
    },
    filterButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#333',
    },
    filterButtonTextActive: {
      color: '#fff',
    },
  })
