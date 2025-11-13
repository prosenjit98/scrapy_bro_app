import React from 'react'
import { FlatList, View } from 'react-native'

import { useGetParts } from '@/stores/hooks/useParts'
import { NoData } from '@/components/NoData'
import MyFlatListLayout from '@/components/MyFlatListLayout'
import PartSkeleton from '@/components/Parts/PartSkeleton'
import PartCard from '@/components/Parts/PartCard'

export const PartsListScreen = () => {
  const { data: partObject, isLoading, refetch } = useGetParts()

  const { data, meta } = partObject! || { data: [], meta: {} }

  return (
    <>
      {isLoading ? <PartSkeleton /> :
        <MyFlatListLayout hasProfileLink={true} withBackButton={true}>
          <View style={{ flex: 1, padding: 10 }}>
            <FlatList
              data={data}
              refreshing={isLoading}
              onRefresh={refetch}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <PartCard item={item} />}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<NoData title="No parts available" description="Please check back later." />}
            />
          </View>
        </MyFlatListLayout>
      }
    </>


  )
}
