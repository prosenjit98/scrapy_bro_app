import React, { useEffect } from 'react';
// import MyLayout from '@/components/MyLayout';
import { View, FlatList, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native'
import { FAB } from 'react-native-paper'
import { InquiryCard } from '@/components/inquiry/InquiryCard'
import { useInquiries } from '@/stores/hooks/useInquiries';
import { my_inquiry_details, new_inquiry } from '@/constants';
import { NoData } from '@/components/NoData';
import useLoaderState from '@/stores/loaderState';
import MyNewHeader from '@/components/MyNewHeader';
import { useThemeStore } from '@/stores/themeStore';
import { AppTheme } from '@/theme';


export default function MyInquiryScreen({ navigation }: any) {

  // const { toggleTheme, mode } = useThemeStore();
  const { colors } = useThemeStore().theme;
  //@ts-ignore
  const styles = makeStyles(colors);
  const { inquiriesQuery, deleteMutation } = useInquiries()
  const { data: inquiries, isLoading, isFetching, refetch } = inquiriesQuery;
  const filters = ['All', 'Pending', 'Accepted', 'Rejected']
  const [filterStatus, setFilterStatus] = React.useState('All')
  const showLoader = React.useCallback(() => {
    useLoaderState.getState().show();
  }, []);

  useEffect(() => {
    if (isLoading || isFetching) {
      showLoader();
    }
  }, [isLoading, isFetching, showLoader]);

  const getStatusLabel = (status?: string | null) => {
    if (!status) return 'Pending'
    const normalized = status.toLowerCase()
    if (normalized.includes('accept')) return 'Accepted'
    if (normalized.includes('reject') || normalized.includes('cancel')) return 'Rejected'
    if (normalized.includes('pending')) return 'Pending'
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const filteredInquiries = filterStatus === 'All'
    ? inquiries?.data
    : inquiries?.data?.filter((item: Inquiry) => getStatusLabel(item.status) === filterStatus)

  return (
    // <MyLayout hasProfileLink={true} withBackButton={true} moduleName="My Inquiries" handleRefetch={refetch} rendering={isLoading}>
    <View style={styles.container}>
      <MyNewHeader withBackButton={true} title="My Inquiries" subtitle="Track your inquiry status" />
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
      <View style={styles.listContainer}>
        <FlatList
          data={filteredInquiries}
          keyExtractor={(item) => item.id.toString()}
          refreshing={isFetching}
          onRefresh={refetch}
          contentContainerStyle={styles.listContent}
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
          style={styles.fab}
          onPress={() => navigation.navigate(new_inquiry)}
        />
      </View>
    </View>


  );
}

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    listContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    listContent: {
      paddingTop: 8,
      paddingBottom: 24,
      gap: 8,
    },
    fab: {
      position: 'absolute',
      right: 16,
      bottom: 16,
    },
  })