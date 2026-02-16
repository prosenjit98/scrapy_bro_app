import React, { useState } from 'react'
import { View, FlatList, StyleSheet, ScrollView, TouchableOpacity, Text, Alert } from 'react-native'
import { Card, Button, Chip } from 'react-native-paper'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'
import { useInquiries } from '@/stores/hooks/useInquiries'
import MyNewHeader from '@/components/MyNewHeader'
import { NoData } from '@/components/NoData'
import Icon from '@react-native-vector-icons/material-design-icons'
import { AppTheme } from '@/theme'
import { vendor_inquiry_detail } from '@/constants'
import ProposalFormContainer from '@/components/Proposal/ProposalFormContainer'

interface VendorInquiriesScreenProps {
  navigation: any
}

const VendorInquiriesScreen: React.FC<VendorInquiriesScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const colors = theme.colors
  // @ts-ignore
  const styles = makeStyles(colors)

  const { inquiriesQuery } = useInquiries()
  const { data: inquiriesData, isLoading, isFetching, refetch } = inquiriesQuery
  const inquiries = inquiriesData?.data || []

  const filters = ['All', 'Pending', 'Open', 'Closed']
  const [filterStatus, setFilterStatus] = useState('All')

  const getStatusLabel = (status?: string | null) => {
    if (!status) return 'Pending'
    const normalized = status.toLowerCase()
    if (normalized.includes('open') || normalized.includes('pending')) return 'Open'
    if (normalized.includes('close') || normalized.includes('accept') || normalized.includes('settle')) return 'Closed'
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const filteredInquiries = filterStatus === 'All'
    ? inquiries
    : inquiries.filter((item: Inquiry) => getStatusLabel(item.status) === filterStatus)

  const hasVendorProposal = (inquiry: Inquiry) => {
    return inquiry.proposals?.some((p: Proposal) => p.vendorId === user?.id)
  }

  const canCreateProposal = (inquiry: Inquiry) => {
    const isOpen = getStatusLabel(inquiry.status) === 'Open'
    const noProposal = !hasVendorProposal(inquiry)
    return isOpen && noProposal
  }

  const handleViewDetails = (inquiry: Inquiry) => {
    navigation.navigate(vendor_inquiry_detail, { inquiry })
  }

  return (
    <View style={styles.container}>
      <MyNewHeader title="Inquiries" subtitle="Browse customer inquiries" withBackButton={true} vendor={true} />

      {/* Filter Tabs */}
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

      {/* Inquiries List */}
      <FlatList
        data={filteredInquiries}
        keyExtractor={(item) => item.id.toString()}
        refreshing={isFetching}
        onRefresh={refetch}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <VendorInquiryCard
            inquiry={item}
            onViewDetails={() => handleViewDetails(item)}
            hasProposal={hasVendorProposal(item)}
            canPropose={canCreateProposal(item)}
            // @ts-ignore
            colors={colors}
            onSuccess={refetch}
          />
        )}
        ListEmptyComponent={
          <NoData
            title="No Inquiries Yet"
            description="Customer inquiries will appear here"
            onRetry={refetch}
            buttonLabel="Refresh"
          />
        }
      />
    </View>
  )
}

interface VendorInquiryCardProps {
  inquiry: Inquiry
  onViewDetails: () => void
  hasProposal: boolean
  canPropose: boolean
  colors: AppTheme['colors']
  onSuccess: () => void
}

const VendorInquiryCard: React.FC<VendorInquiryCardProps> = ({
  inquiry,
  onViewDetails,
  hasProposal,
  canPropose,
  colors,
  onSuccess,
}) => {
  // @ts-ignore
  const styles = makeStyles(colors)

  const getStatusColor = (status: string) => {
    const label = status?.toLowerCase() || ''
    if (label.includes('open') || label.includes('pending')) return '#10b981'
    if (label.includes('close') || label.includes('settle')) return '#6b7280'
    return '#f59e0b'
  }

  return (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={2}>
              {inquiry.title}
            </Text>
            <View style={styles.metaRow}>
              <Icon name="account" size={14} color="#666" style={{ marginRight: 4 }} />
              <Text style={styles.metaText}>{inquiry.user?.fullName || 'Customer'}</Text>
            </View>
          </View>
          <Chip
            mode="flat"
            style={[styles.statusChip, { backgroundColor: getStatusColor(inquiry.status) + '20' }]}
            textStyle={[styles.statusText, { color: getStatusColor(inquiry.status) }]}
          >
            {inquiry.status || 'Pending'}
          </Chip>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {inquiry.partDescription}
        </Text>

        {/* Vehicle Info */}
        {(inquiry.make || inquiry.model || inquiry.year) && (
          <View style={styles.vehicleInfo}>
            <Icon name="car" size={16} color={colors.vendorPrimary} style={{ marginRight: 6 }} />
            <Text style={styles.vehicleText}>
              {inquiry.make?.name} {inquiry.model?.name} {inquiry.year ? `(${inquiry.year})` : ''}
            </Text>
          </View>
        )}

        {/* Proposal Count */}
        <View style={styles.proposalCount}>
          <Icon name="file-document" size={16} color="#666" style={{ marginRight: 6 }} />
          <Text style={styles.proposalCountText}>
            {inquiry.proposalsCount || 0} Proposal{inquiry.proposalsCount !== 1 ? 's' : ''}
          </Text>
          {hasProposal && (
            <Chip
              mode="flat"
              icon="check"
              style={styles.submittedChip}
              textStyle={styles.submittedChipText}
            >
              Submitted
            </Chip>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={onViewDetails}
            style={styles.actionButton}
            icon="eye"
            compact
          >
            View Details
          </Button>
          {canPropose && (
            <ProposalFormContainer
              buttonLabel="Create Proposal"
              relatedObjId={inquiry.id}
              mode="contained"
              style={[styles.actionButton, { backgroundColor: colors.vendorPrimary }]}
              onSuccessNavigation={onSuccess}
            />
          )}
        </View>

        {/* Already Submitted Message */}
        {hasProposal && !canPropose && (
          <View style={styles.infoMessage}>
            <Icon name="information" size={16} color="#666" style={{ marginRight: 6 }} />
            <Text style={styles.infoMessageText}>
              You've already submitted a proposal for this inquiry
            </Text>
          </View>
        )}
      </View>
    </Card>
  )
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
      backgroundColor: colors.vendorPrimary,
    },
    filterButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#333',
    },
    filterButtonTextActive: {
      color: '#fff',
    },
    listContent: {
      padding: 16,
    },
    card: {
      borderRadius: 12,
      marginBottom: 12,
      elevation: 2,
    },
    cardContent: {
      padding: 16,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
      gap: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 6,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaText: {
      fontSize: 12,
      color: '#666',
    },
    statusChip: {
      height: 28,
    },
    statusText: {
      fontSize: 11,
      fontWeight: '600',
    },
    description: {
      fontSize: 14,
      color: '#666',
      lineHeight: 20,
      marginBottom: 12,
    },
    vehicleInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.vendorPrimary + '10',
      borderRadius: 8,
      marginBottom: 12,
    },
    vehicleText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
    },
    proposalCount: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    proposalCountText: {
      fontSize: 13,
      color: '#666',
      fontWeight: '500',
      flex: 1,
    },
    submittedChip: {
      height: 24,
      backgroundColor: '#10b981' + '20',
    },
    submittedChipText: {
      fontSize: 10,
      color: '#10b981',
      fontWeight: '600',
    },
    actions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      flex: 1,
    },
    infoMessage: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: '#f3f4f6',
      borderRadius: 6,
      marginTop: 12,
    },
    infoMessageText: {
      fontSize: 12,
      color: '#666',
      flex: 1,
    },
  })

export default VendorInquiriesScreen
