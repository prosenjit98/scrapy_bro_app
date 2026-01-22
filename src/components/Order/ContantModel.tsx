
import { useThemeStore } from "@/stores/themeStore"
import { View, Modal, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput } from "react-native"
import { Text, Button } from "react-native-paper"
import Icon, { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons'
import { AppTheme } from "@/theme"
import { useState } from "react"
const ContactModal = ({ visible, order, onDismiss }: any) => {
  const { colors } = useThemeStore().theme
  //@ts-ignore
  const styles = makeStyles(colors)

  const contactOptions = [
    { icon: 'message', label: 'Start Chat', description: 'Send a message to the vendor' },
    { icon: 'phone', label: 'Call Vendor', description: '+91 98765 43210' },
    { icon: 'email', label: 'Email Vendor', description: 'vendor@scrapy.com' },
  ]

  const quickMessages = [
    'When will my order be delivered?',
    'I want to modify my order',
    'Need help with payment',
  ]

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Contact Vendor</Text>
              <Text style={styles.modalSubtitle}>{order?.vendor}</Text>
            </View>
            <TouchableOpacity onPress={onDismiss}>
              <Icon name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Contact Options */}
            <View style={styles.contactOptions}>
              {contactOptions.map((option, index) => (
                <TouchableOpacity key={index} style={styles.contactOption}>
                  <View style={styles.contactIconContainer}>
                    <Icon name={option.icon as MaterialDesignIconsIconName} size={24} color="#4f46e5" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contactOptionLabel}>{option.label}</Text>
                    <Text style={styles.contactOptionDesc}>{option.description}</Text>
                  </View>
                  <Icon name="chevron-right" size={20} color="#d1d5db" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Quick Messages */}
            <View style={styles.quickMessagesSection}>
              <Text style={styles.quickMessagesLabel}>Quick Messages</Text>
              {quickMessages.map((message, index) => (
                <TouchableOpacity key={index} style={styles.quickMessage}>
                  <Text style={styles.quickMessageText}>{message}</Text>
                </TouchableOpacity>
              ))}
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

export default ContactModal

const makeStyles = (_colors: AppTheme['colors']) =>
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
    contactOptions: {
      marginBottom: 20,
      gap: 10,
    },
    contactOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      borderRadius: 12,
      padding: 12,
    },
    contactIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: '#eef2ff',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    contactOptionLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#111',
      marginBottom: 2,
    },
    contactOptionDesc: {
      fontSize: 12,
      color: '#666',
    },
    quickMessagesSection: {
      marginBottom: 20,
    },
    quickMessagesLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#111',
      marginBottom: 10,
    },
    quickMessage: {
      backgroundColor: '#f9fafb',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginBottom: 8,
    },
    quickMessageText: {
      fontSize: 13,
      color: '#333',
    },
  })