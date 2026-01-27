import React from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import MyFlatListLayout from '@/components/MyFlatListLayout'
import { useGetParts } from '@/stores/hooks/useParts'
import { NoData } from '@/components/NoData'
import PartSkeleton from '@/components/Parts/PartSkeleton'
import PartCardGrid from '@/components/Parts/PartCardGrid'
import { useThemeStore } from '@/stores/themeStore'
import { AppTheme } from '@/theme'

export const PartsListScreen = (props: { userView?: boolean }) => {
  const theme = useThemeStore().theme
  const { colors } = theme
  //@ts-ignore
  const styles = makeStyles(colors)
  const { data: partObject, isLoading, refetch } = useGetParts()

  const { data = [] } = partObject || {}

  const renderItem = ({ item, index }: any) => {
    const isEvenIndex = index % 2 === 0
    return (
      <View style={[styles.gridItemWrapper, isEvenIndex ? { marginRight: 6 } : { marginLeft: 6 }]}>
        <PartCardGrid item={item} userView={props.userView} />
      </View>
    )
  }

  return (
    <MyFlatListLayout hasProfileLink={true} withBackButton={true} moduleName="Parts">
      {isLoading ? (
        <PartSkeleton />
      ) : (
        <FlatList
          data={data}
          refreshing={isLoading}
          onRefresh={refetch}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={
            <NoData title="No parts available" description="Please check back later." />
          }
        />
      )}
    </MyFlatListLayout>
  )
}

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    columnWrapper: {
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    contentContainer: {
      padding: 8,
    },
    gridItemWrapper: {
      width: '48%',
    },
  })
