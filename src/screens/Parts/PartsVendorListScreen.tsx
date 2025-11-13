import React from 'react'
import { FlatList, View } from 'react-native'

import { useVendorParts } from '@/stores/hooks/useParts'
import { NoData } from '@/components/NoData'
import MyFlatListLayout from '@/components/MyFlatListLayout'
import PartSkeleton from '@/components/Parts/PartSkeleton'
import PartCard from '@/components/Parts/PartCard'
import { useAuthStore } from '@/stores/authStore'
import { FAB } from 'react-native-paper'
import { part_create } from '@/constants'

const PartsVendorListScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const { data: partObject, isLoading, refetch } = useVendorParts(user?.id!)

  const { data, meta } = partObject! || { data: [], meta: {} }

  return (
    <>
      {isLoading ? <PartSkeleton /> :
        <MyFlatListLayout hasProfileLink={true} withBackButton={true} moduleName="My Parts" handleRefetch={refetch} rendering={isLoading}>
          <View style={{ flex: 1, padding: 10 }}>
            <FlatList
              data={data}
              refreshing={isLoading}
              onRefresh={refetch}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <PartCard item={item} />}
              // showsVerticalScrollIndicator={false}
              ListEmptyComponent={<NoData title="No parts available" description="Please check back later." />}
            />
          </View>
          <FAB
            icon="plus"
            style={{
              position: 'absolute',
              right: 16,
              bottom: 16,
            }}
            onPress={() => { navigation.navigate(part_create) }}
          />
        </MyFlatListLayout>
      }
    </>


  )
}

export default PartsVendorListScreen
