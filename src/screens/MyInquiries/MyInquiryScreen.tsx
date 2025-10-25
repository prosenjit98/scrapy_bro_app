import React, { useEffect } from 'react';
// import MyLayout from '@/components/MyLayout';
import { View, FlatList, ActivityIndicator } from 'react-native'
import { FAB } from 'react-native-paper'
import { InquiryCard } from '@/components/inquiry/InquiryCard'
import { useInquiries } from '@/stores/hooks/useInquiries';
import { my_inquiry_details, new_inquiry } from '@/constants';
import { NoData } from '@/components/NoData';
import useLoaderState from '@/stores/loaderState';
import MyHeader from '@/components/MyHeader';
import { useThemeStore } from '@/stores/themeStore';


export default function MyInquiryScreen({ navigation }: any) {

  // const { toggleTheme, mode } = useThemeStore();
  const { colors } = useThemeStore().theme;
  const { inquiriesQuery, deleteMutation } = useInquiries()
  const { data: inquiries, isLoading, isFetching, refetch } = inquiriesQuery;
  const showLoader = React.useCallback(() => {
    useLoaderState.getState().show();
  }, []);

  useEffect(() => {
    if (isLoading || isFetching) {
      showLoader();
    }
  }, [isLoading, isFetching, showLoader]);

  return (
    // <MyLayout hasProfileLink={true} withBackButton={true} moduleName="My Inquiries" handleRefetch={refetch} rendering={isLoading}>
    <>
      <MyHeader hasProfileLink={true} withBackButton={true} moduleName={'My Inquiries'} />
      <View style={{ flex: 1, padding: 12, backgroundColor: colors.background, justifyContent: 'flex-start' }}>
        <FlatList
          data={inquiries?.data}
          keyExtractor={(item) => item.id.toString()}
          refreshing={isFetching}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <InquiryCard
              inquiry={item}
              onPress={() => navigation.navigate(my_inquiry_details, { inquiryId: item.id })}
              onEdit={() => navigation.navigate(new_inquiry, { inquiry: item })}
              onDelete={() => deleteMutation.mutate(item.id)}
            />
          )}
          ListEmptyComponent={<NoData
            title="No Inquiries Yet"
            description="You haven’t posted any inquiries yet."
            onRetry={refetch}
            buttonLabel="Refresh"
          />}
        />
        <FAB
          icon="plus"
          style={{
            position: 'absolute',
            right: 16,
            bottom: 16,
          }}
          onPress={() => navigation.navigate(new_inquiry)}
        />
      </View>
    </>


  );
}