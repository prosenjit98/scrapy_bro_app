import React from 'react'
import { View, FlatList, TouchableOpacity, Text } from 'react-native'
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


const BargainingListScreen: React.FC<{}> = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Root'>>();
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, refetch } = useMyBargain(user?.id, [{ key: 'userId', value: user?.id?.toString()! }, { key: 'withParts', value: 1 }]);
  console.log('Bargaining data:', data);

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

  return (
    <MyFlatListLayout hasProfileLink={true} withBackButton={true} moduleName="My Bargaining">
      <FlatList
        data={data}
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
    </MyFlatListLayout>

  )
}
export default BargainingListScreen
