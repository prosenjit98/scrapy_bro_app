import React from 'react'
import { Image, StyleSheet, View, ScrollView, RefreshControl } from 'react-native'
import { Avatar, Text, Card, Divider } from 'react-native-paper'
import dayjs from 'dayjs'
import { useRoute } from '@react-navigation/native'
import MyNewHeader from '@/components/MyNewHeader'
import { useThemeStore } from '@/stores/themeStore'
import { useInquiries } from '@/stores/hooks/useInquiries'
import InquirySkeleton from '@/components/inquiry/InquirySkeleton'
import UserProposalListScreen from '../Proposals/UserProposalListScreen'
import { useUserProposals } from '@/stores/hooks/useProposals'
import { AppTheme } from '@/theme'

export const InquiryDetailScreen = () => {
  const theme = useThemeStore().theme
  const { colors } = theme
  //@ts-ignore
  const styles = makeStyles(colors)
  const route = useRoute()
  const { inquiryId } = route.params as { inquiryId: number }
  const { getInquiry } = useInquiries()
  const { isPending, data: inquiry, refetch } = getInquiry(inquiryId)
  const { refetch: refetchUserProposal } = useUserProposals(inquiryId)

  const handleRefetch = () => {
    refetch()
    refetchUserProposal()
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <MyNewHeader withBackButton={true} title="Inquiry Details" subtitle="Review inquiry and proposals" />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isPending} onRefresh={handleRefetch} />
        }
      >
        {inquiry ? (
          <>
            <Card style={styles.card}>
              <Card.Title
                title={inquiry.user?.fullName || 'Anonymous'}
                subtitle={dayjs(inquiry.createdAt).format('MMM D, YYYY')}
                left={() => (
                  <Avatar.Image
                    size={42}
                    source={
                      // inquiry.user?.avatar
                      //   ? { uri: inquiry.user.avatar }
                      //   : 
                      require('@/assets/images/avatar.png')
                    }
                  />
                )}
              />
              <Card.Content>
                <Text variant="titleLarge" style={styles.title}>
                  {inquiry.title}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
                >
                  {inquiry.partDescription}
                </Text>

                {inquiry?.attachments && inquiry?.attachments?.length > 0 && (
                  <View style={styles.imageGrid}>
                    {inquiry.attachments.map((file, i: number) => (
                      <Image key={i} source={{ uri: file.file.url }} style={styles.image} />
                    ))}
                  </View>
                )}
              </Card.Content>
            </Card>

            <Divider style={styles.divider} />
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Vendor Proposals
            </Text>

            <UserProposalListScreen inquiryId={inquiryId} />
          </>
        ) : (
          <InquirySkeleton />
        )}
      </ScrollView>
    </View>
  )
}

export default InquiryDetailScreen

const HEADER_HEIGHT = 160
const HEADER_OVERLAP = 20

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      overflow: 'visible',
    },
    headerWrap: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 0,
    },
    scroll: {
      zIndex: 1,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: HEADER_HEIGHT - HEADER_OVERLAP,
      paddingBottom: 24,

    },
    card: {
      borderRadius: 12,
      marginTop: -HEADER_OVERLAP,
      zIndex: 2,
      elevation: 8,
    },
    title: {
      fontWeight: '700',
      marginTop: 8,
      marginBottom: 4,
    },
    description: {
      marginBottom: 12,
    },
    imageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    image: {
      width: '48%',
      height: 180,
      borderRadius: 8,
      margin: '1%',
    },
    divider: {
      marginVertical: 16,
    },
    sectionTitle: {
      marginBottom: 8,
    },
  })
