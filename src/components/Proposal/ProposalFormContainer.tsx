import React, { useState } from 'react'
import { StyleSheet, View, Modal, TouchableOpacity, ScrollView } from 'react-native'
import { Button, Text } from 'react-native-paper'
import Icon from '@react-native-vector-icons/material-design-icons'
import { useThemeStore } from '@/stores/themeStore'
import { AppTheme } from '@/theme'
import { ProposalForm } from './ProposalForm'

type Props = {
  buttonLabel: string
  relatedObjId?: number
  defaultValues?: any
  style?: View['props']['style']
  mode?: 'contained' | 'outlined'
  onSuccessNavigation?: () => void
}

const ProposalFormContainer: React.FC<Props> = ({
  buttonLabel,
  defaultValues,
  style,
  mode = 'outlined',
  onSuccessNavigation,
  relatedObjId,
}) => {
  const [visible, setVisible] = useState(false)
  const theme = useThemeStore().theme
  const { colors } = theme
  //@ts-ignore
  const styles = makeStyles(colors)

  const open = () => setVisible(true)
  const close = () => setVisible(false)

  const onSuccess = () => {
    close()
    onSuccessNavigation?.()
  }

  const isBargain = buttonLabel === 'Bargain'

  return (
    <>
      <Button mode={mode} onPress={open} style={style} icon="message-outline">
        {buttonLabel}
      </Button>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={close}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {isBargain ? 'Bargain Proposal' : 'Create Proposal'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {isBargain
                    ? 'Propose your desired price and details'
                    : 'Submit your proposal details'}
                </Text>
              </View>
              <TouchableOpacity onPress={close}>
                <Icon name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              <ProposalForm
                onCancel={close}
                buttonLabel={buttonLabel}
                relatedObjId={relatedObjId}
                onSuccess={onSuccess}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}

const makeStyles = (colors: AppTheme['colors']) =>
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
      maxHeight: '90%',
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      flex: 1,
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
  })

export default ProposalFormContainer