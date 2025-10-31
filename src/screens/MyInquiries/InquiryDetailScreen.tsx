import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Avatar, Text, Card, Divider, Button } from 'react-native-paper'
import dayjs from 'dayjs'
import { useRoute } from '@react-navigation/native'
import MyLayout from '@/components/MyLayout'
import { useThemeStore } from '@/stores/themeStore'
import { useInquiries } from '@/stores/hooks/useInquiries'
import InquirySkeleton from '@/components/inquiry/InquirySkeleton'
import UserProposalListScreen from '../Proposals/UserProposalListScreen'
import { useUserProposals } from '@/stores/hooks/useProposals'

export const InquiryDetailScreen = () => {
  const theme = useThemeStore().theme
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
    <MyLayout withBackButton={true} hasProfileLink={true} moduleName={'Inquiry Details'} handleRefetch={handleRefetch} rendering={isPending}>
      {inquiry ?
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


          <Divider style={{ marginVertical: 16 }} />
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            Vendor Proposals
          </Text>

          {/* {inquiry?.proposals && inquiry.proposals?.length > 0 ? (
            inquiry.proposals.map((p: any, i: number) => (
              <Card key={i} style={{ marginBottom: 10 }}>
                <Card.Title
                  title={p.vendor?.name || 'Vendor'}
                  subtitle={`Offer: ₹${p.price}`}
                  left={() => (
                    <Avatar.Image
                      size={36}
                      source={
                        p.vendor?.avatar
                          ? { uri: p.vendor.avatar }
                          : require('@/assets/images/avatar.png')
                      }
                    />
                  )}
                />
                <Card.Content>
                  <Text>{p.message}</Text>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text>No proposals yet.</Text>
          )} */}
          <UserProposalListScreen inquiryId={inquiryId} />

          {/* <Button
            mode="contained"
            style={{ marginTop: 16 }}
            onPress={() => console.log('Chat / Proposal action')}
          >
            Message Vendor
          </Button> */}
        </> : <InquirySkeleton />}
    </MyLayout>
  )
}

export default InquiryDetailScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
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
})
