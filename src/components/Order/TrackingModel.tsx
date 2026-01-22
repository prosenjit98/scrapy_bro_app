import { useThemeStore } from "@/stores/themeStore"
import { View, Modal, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { Text, Button } from "react-native-paper"
import Icon, { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons'
import { AppTheme } from "@/theme"

const TrackingModal = ({ visible, order, onDismiss }: any) => {
  const { colors } = useThemeStore().theme
  //@ts-ignore
  const styles = makeStyles(colors)

  const getTrackingSteps = (status: string) => {
    return [
      { label: 'Order Placed', status: 'completed' },
      { label: 'Confirmed', status: status === 'pending' ? 'pending' : 'completed' },
      { label: 'Shipped', status: status === 'shipped' || status === 'completed' ? 'completed' : status === 'pending' ? 'inactive' : 'pending' },
      { label: 'Delivered', status: status === 'completed' ? 'completed' : 'inactive' },
    ]
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Track Order</Text>
              <Text style={styles.modalSubtitle}>{`Order ID: ${order?.id}`}</Text>
            </View>
            <TouchableOpacity onPress={onDismiss}>
              <Icon name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Tracking Timeline */}
            <View style={styles.timelineSection}>
              {getTrackingSteps(order?.status).map((step: any, index: number) => {
                const isCompleted = step.status === 'completed'
                const isPending = step.status === 'pending'
                const stepColor = isCompleted ? '#10b981' : isPending ? '#3b82f6' : '#d1d5db'

                return (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineCircle}>
                      <View style={[styles.timelineDot, { backgroundColor: stepColor }]}>
                        {isCompleted && <Icon name="check" size={14} color="#fff" />}
                        {isPending && <Icon name="clock-outline" size={14} color="#fff" />}
                      </View>
                      {index < getTrackingSteps(order?.status).length - 1 && (
                        <View style={[styles.timelineLine, { backgroundColor: stepColor }]} />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={[styles.timelineLabel, { color: stepColor }]}>
                        {step.label}
                      </Text>
                      <Text style={styles.timelineStatus}>
                        {isCompleted ? 'Completed' : isPending ? 'In progress...' : 'Pending'}
                      </Text>
                    </View>
                  </View>
                )
              })}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <Button mode="outlined" style={{ flex: 1 }} onPress={onDismiss}>
              Close
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default TrackingModal

const makeStyles = (colors: AppTheme['colors']) => (
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      height: '90%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#111',
      marginBottom: 4,
    },
    modalSubtitle: {
      fontSize: 13,
      color: '#666',
    },
    modalBody: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    modalFooter: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: '#f3f4f6',
    },
    timelineSection: {
      marginBottom: 20,
    },
    timelineItem: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    timelineCircle: {
      alignItems: 'center',
      marginRight: 12,
      width: 30,
    },
    timelineDot: {
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    timelineLine: {
      width: 2,
      flex: 1,
      marginTop: 8,
    },
    timelineContent: {
      flex: 1,
      paddingTop: 4,
    },
    timelineLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 2,
    },
    timelineStatus: {
      fontSize: 12,
      color: '#666',
    },
  })
)
