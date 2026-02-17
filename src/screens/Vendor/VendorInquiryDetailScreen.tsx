import React, { useState } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
} from 'react-native'
import { Card, Text, Button, Divider, Chip } from 'react-native-paper'
import Icon from '@react-native-vector-icons/material-design-icons'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'
import { AppTheme } from '@/theme'
import MyNewHeader from '@/components/MyNewHeader'
import ProposalFormContainer from '@/components/Proposal/ProposalFormContainer'
import ProposalChatModal from '@/components/Proposal/ProposalChatModal'

interface VendorInquiryDetailScreenProps {
  route: any
  navigation: any
}

const VendorInquiryDetailScreen: React.FC<VendorInquiryDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { inquiry } = route.params
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const colors = theme.colors
  // @ts-ignore
  const styles = makeStyles(colors)
  const { width } = Dimensions.get('window')

  const hasVendorProposal = inquiry.proposals?.some((p: Proposal) => p.proposerId === user?.id)
  const vendorProposal = inquiry.proposals?.find((p: Proposal) => p.proposerId === user?.id)

  const [chatModalVisible, setChatModalVisible] = useState(false)

  const handleOpenChat = () => {
    if (vendorProposal) {
      setChatModalVisible(true)
    }
  }

  const handleCloseChat = () => {
    setChatModalVisible(false)
  }

  const getStatusLabel = (status?: string | null) => {
    if (!status) return 'Pending'
    const normalized = status.toLowerCase()
    if (normalized.includes('open') || normalized.includes('pending')) return 'Open'
    if (normalized.includes('close') || normalized.includes('accept') || normalized.includes('settle')) return 'Closed'
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const canCreateProposal = () => {
    const isOpen = getStatusLabel(inquiry.status) === 'Open'
    return isOpen && !hasVendorProposal
  }

  const handleProposalSuccess = () => {
    // Optionally refetch inquiry or navigate back
    Alert.alert('Success', 'Your proposal has been submitted successfully!')
  }

  const getStatusColor = (status: string) => {
    const label = status?.toLowerCase() || ''
    if (label.includes('open') || label.includes('pending')) return '#10b981'
    if (label.includes('close') || label.includes('settle')) return '#6b7280'
    return '#f59e0b'
  }

  return (
    <View style={styles.container}>
      <MyNewHeader title="Inquiry Details" withBackButton={true} vendor={true} subtitle='check full details of the inquiry' />
      {/* Status and Title Card */}
      <Card style={styles.headerCard}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inquiryId}>Inquiry #{inquiry.id}</Text>
              <Text style={styles.title}>{inquiry.title}</Text>
            </View>
            <Chip
              mode="flat"
              style={[styles.statusChip, { backgroundColor: getStatusColor(inquiry.status) + '20' }]}
              textStyle={[styles.statusText, { color: getStatusColor(inquiry.status) }]}
            >
              {inquiry.status || 'Pending'}
            </Chip>
          </View>

          {hasVendorProposal && (
            <View style={styles.submittedBanner}>
              <Icon name="check-circle" size={20} color="#10b981" style={{ marginRight: 8 }} />
              <Text style={styles.submittedText}>You've submitted a proposal for this inquiry</Text>
            </View>
          )}
        </View>
      </Card>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        style={{ top: -35 }}
      >


        {/* Customer Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <Divider style={{ marginVertical: 12 }} />

          <View style={styles.infoRow}>
            <Icon name="account" size={20} color={colors.vendorPrimary} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{inquiry.user?.fullName || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="email" size={20} color={colors.vendorPrimary} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{inquiry.user?.email || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar" size={20} color={colors.vendorPrimary} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Posted Date</Text>
              <Text style={styles.infoValue}>
                {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Part Description */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Part Description</Text>
          <Divider style={{ marginVertical: 12 }} />
          <Text style={styles.description}>{inquiry.partDescription}</Text>
        </Card>

        {/* Vehicle Information */}
        {(inquiry.make || inquiry.model || inquiry.year) && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>
            <Divider style={{ marginVertical: 12 }} />

            <View style={styles.vehicleGrid}>
              {inquiry.make && (
                <View style={styles.vehicleItem}>
                  <Text style={styles.vehicleLabel}>Make</Text>
                  <View style={styles.vehicleValueContainer}>
                    <Icon name="car" size={18} color={colors.vendorPrimary} style={{ marginRight: 6 }} />
                    <Text style={styles.vehicleValue}>{inquiry.make.name}</Text>
                  </View>
                </View>
              )}

              {inquiry.model && (
                <View style={styles.vehicleItem}>
                  <Text style={styles.vehicleLabel}>Model</Text>
                  <View style={styles.vehicleValueContainer}>
                    <Icon name="car-side" size={18} color={colors.vendorPrimary} style={{ marginRight: 6 }} />
                    <Text style={styles.vehicleValue}>{inquiry.model.name}</Text>
                  </View>
                </View>
              )}

              {inquiry.year && (
                <View style={styles.vehicleItem}>
                  <Text style={styles.vehicleLabel}>Year</Text>
                  <View style={styles.vehicleValueContainer}>
                    <Icon name="calendar-blank" size={18} color={colors.vendorPrimary} style={{ marginRight: 6 }} />
                    <Text style={styles.vehicleValue}>{inquiry.year}</Text>
                  </View>
                </View>
              )}
            </View>
          </Card>
        )}

        {/* Attachments */}
        {inquiry.attachments && inquiry.attachments.length > 0 && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Attachments ({inquiry.attachments.length})</Text>
            <Divider style={{ marginVertical: 12 }} />

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.imagesContainer}>
                {inquiry.attachments.map((attachment: InquiryAttachment, index: number) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image
                      source={{ uri: attachment.file.url }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          </Card>
        )}

        {/* Proposals Summary */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Proposals Summary</Text>
          <Divider style={{ marginVertical: 12 }} />

          <View style={styles.proposalSummary}>
            <View style={styles.proposalStat}>
              <Text style={styles.proposalStatValue}>{inquiry.proposalsCount || 0}</Text>
              <Text style={styles.proposalStatLabel}>Total Proposals</Text>
            </View>
            <Divider style={{ width: 1, height: '100%' }} />
            <View style={styles.proposalStat}>
              <Text style={[styles.proposalStatValue, { color: hasVendorProposal ? '#10b981' : '#999' }]}>
                {hasVendorProposal ? '1' : '0'}
              </Text>
              <Text style={styles.proposalStatLabel}>Your Proposals</Text>
            </View>
          </View>

          {vendorProposal && (
            <View style={styles.yourProposalCard}>
              <Text style={styles.yourProposalTitle}>Your Proposal</Text>
              <View style={styles.proposalDetailRow}>
                <Text style={styles.proposalDetailLabel}>Price:</Text>
                <Text style={styles.proposalDetailValue}>₹{vendorProposal.price}</Text>
              </View>
              <View style={styles.proposalDetailRow}>
                <Text style={styles.proposalDetailLabel}>Quantity:</Text>
                <Text style={styles.proposalDetailValue}>{vendorProposal.quantity}</Text>
              </View>
              {vendorProposal.description && (
                <View style={styles.proposalDetailRow}>
                  <Text style={styles.proposalDetailLabel}>Description:</Text>
                  <Text style={[styles.proposalDetailValue, { flex: 1 }]} numberOfLines={2}>
                    {vendorProposal.description}
                  </Text>
                </View>
              )}
            </View>
          )}
        </Card>

        {/* Action Buttons */}
        {canCreateProposal() && (
          <ProposalFormContainer
            buttonLabel="Create Proposal"
            relatedObjId={inquiry.id}
            mode="contained"
            style={[styles.createButton, { backgroundColor: colors.vendorPrimary }]}
            onSuccessNavigation={handleProposalSuccess}
          />
        )}

        {/* Chat Button if proposal exists */}
        {hasVendorProposal && vendorProposal && (
          <Button
            mode="contained"
            onPress={handleOpenChat}
            style={[styles.createButton, { backgroundColor: colors.vendorPrimary }]}
            icon="message"
            contentStyle={{ height: 50 }}
          >
            Chat with Customer
          </Button>
        )}

        {!canCreateProposal() && !hasVendorProposal && (
          <View style={styles.closedMessage}>
            <Icon name="lock" size={24} color="#999" style={{ marginBottom: 8 }} />
            <Text style={styles.closedMessageText}>This inquiry is closed for new proposals</Text>
          </View>
        )}
      </ScrollView>

      {/* Chat Modal */}
      {vendorProposal && (
        <ProposalChatModal
          visible={chatModalVisible}
          onDismiss={handleCloseChat}
          proposal={vendorProposal}
          onProposalAccepted={handleCloseChat}
        />
      )}
    </View>
  )
}

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
      paddingBottom: 32
    },
    headerCard: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      marginHorizontal: 16,
      top: -35
    },
    headerContent: {
      gap: 12,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12,
    },
    inquiryId: {
      fontSize: 12,
      color: '#999',
      marginBottom: 4,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    statusChip: {
      height: 28,
    },
    statusText: {
      fontSize: 11,
      fontWeight: '600',
    },
    submittedBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: '#10b981' + '10',
      borderRadius: 8,
    },
    submittedText: {
      flex: 1,
      fontSize: 13,
      fontWeight: '600',
      color: '#10b981',
    },
    section: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      elevation: 1,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    infoLabel: {
      fontSize: 12,
      color: '#999',
      fontWeight: '500',
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '600',
    },
    description: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 22,
    },
    vehicleGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    vehicleItem: {
      flex: 1,
      minWidth: '45%',
    },
    vehicleLabel: {
      fontSize: 12,
      color: '#999',
      fontWeight: '500',
      marginBottom: 6,
    },
    vehicleValueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.vendorPrimary + '10',
      borderRadius: 8,
    },
    vehicleValue: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    imagesContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    imageWrapper: {
      width: 120,
      height: 120,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#f3f4f6',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    proposalSummary: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    proposalStat: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 12,
    },
    proposalStatValue: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.vendorPrimary,
      marginBottom: 4,
    },
    proposalStatLabel: {
      fontSize: 12,
      color: '#666',
      fontWeight: '500',
    },
    yourProposalCard: {
      marginTop: 16,
      padding: 12,
      backgroundColor: colors.vendorPrimary + '08',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.vendorPrimary + '30',
    },
    yourProposalTitle: {
      fontSize: 13,
      fontWeight: 'bold',
      color: colors.vendorPrimary,
      marginBottom: 8,
    },
    proposalDetailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    proposalDetailLabel: {
      fontSize: 12,
      color: '#666',
      fontWeight: '500',
      width: 80,
    },
    proposalDetailValue: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '600',
    },
    createButton: {
      marginTop: 8,
    },
    closedMessage: {
      alignItems: 'center',
      paddingVertical: 24,
      paddingHorizontal: 16,
    },
    closedMessageText: {
      fontSize: 14,
      color: '#999',
      textAlign: 'center',
    },
  })

export default VendorInquiryDetailScreen
