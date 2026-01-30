import React from 'react'
import { View, FlatList, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native'
import { Card } from 'react-native-paper'

import { useMyBargain } from '@/stores/hooks/useProposals'
import { NoData } from '@/components/NoData'
import SkeletonBox from '@/components/SkeletonBox'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '@/types/navigation'
import { useAuthStore } from '@/stores/authStore'
import MyFlatListLayout from '@/components/MyFlatListLayout'
import BargainingCard from '@/components/Proposal/BargainingCard'
import ProposalFormContainer from '@/components/Proposal/ProposalFormContainer'
import { useThemeStore } from '@/stores/themeStore'
import Icon from '@react-native-vector-icons/material-design-icons'
import MyNewHeader from '@/components/MyNewHeader'
import { AppTheme } from '@/theme'


const BargainingListScreen: React.FC<{}> = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Root'>>();
  const user = useAuthStore((s) => s.user);
  const { colors } = useThemeStore().theme;
  //@ts-ignore
  const styles = makeStyles(colors);
  const { data, isLoading, refetch } = useMyBargain(user?.id, [{ key: 'userId', value: user?.id?.toString()! }, { key: 'withParts', value: 1 }]);

  if (isLoading) {
    return (
      <>
        <Card>
          <View style={{ padding: 16 }}>
            <SkeletonBox height={20} width="60%" />
            <SkeletonBox height={10} width="90%" />
            <SkeletonBox height={10} width="90%" />
            <SkeletonBox height={10} width="90%" />
          </View>
        </Card>
        <Card>
          <View style={{ padding: 16 }}>
            <SkeletonBox height={20} width="60%" />
            <SkeletonBox height={10} width="90%" />
            <SkeletonBox height={10} width="90%" />
            <SkeletonBox height={10} width="90%" />
          </View>
        </Card>
        <Card>
          <View style={{ padding: 16 }}>
            <SkeletonBox height={20} width="60%" />
            <SkeletonBox height={10} width="90%" />
            <SkeletonBox height={10} width="90%" />
            <SkeletonBox height={10} width="90%" />
          </View>
        </Card>
      </>
    )
  }


  const filters = ['All', 'Pending', 'Accepted', 'Rejected']
  const [filterStatus, setFilterStatus] = React.useState('All')

  const getStatusLabel = (isSelfAccepted: boolean | null) => {
    if (isSelfAccepted === null || isSelfAccepted === undefined) return 'Pending'
    return isSelfAccepted ? 'Accepted' : 'Rejected'
  }

  const filteredOrders = filterStatus === 'All'
    ? data
    : data?.filter(o => getStatusLabel(o.isSelfAccepted) === filterStatus)

  const filterComponent = () => {

    return (
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
    )
  }

  return (
    <View style={[styles.container]}>
      <MyNewHeader withBackButton={true} title='My Bargaining' subtitle='Track all your bargaining status' />
      {filterComponent()}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={<NoData title="No bargaining yet" description="Sorry No vendor have been sent any bargaining yet" />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => { navigation.navigate('ProposalDetails', { proposalId: item.id }) }}>
            <BargainingCard item={item} />
          </TouchableOpacity>
        )}
      />
    </View>

  )
}
export default BargainingListScreen


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
    }
  })
