import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Modal, Portal, Text, useTheme } from 'react-native-paper'
import { ProposalForm } from './ProposalForm'

type Props = {
  buttonLabel: string
  relatedObjId?: number
  defaultValues?: any
  style?: View['props']['style']
  mode?: 'contained' | 'outlined'
  onSuccessNavigation?: () => void
}

const ProposalFormContainer: React.FC<Props> = ({ buttonLabel, defaultValues, style, mode, onSuccessNavigation, relatedObjId }) => {
  const [visible, setVisible] = useState(false)
  const theme = useTheme()

  const open = () => setVisible(true)
  const close = () => setVisible(false)

  const onSuccess = () => {
    close()
    onSuccessNavigation?.()
  }

  return (
    <>
      <Button mode={mode} onPress={open} style={style}>
        {buttonLabel}
      </Button>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={close}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}
        >
          <View style={{ marginBottom: 12 }}>
            // Design this section if buttonLabel is 'Bargain' add proper header text and instruction for bargain

            {buttonLabel === 'Bargain' && (
              <>
                <Text variant="titleLarge" >Bargain Proposal</Text>
                <Text>If price not suited to you can bargain. Please provide your bargain details below.</Text>
              </>
            )}
            {buttonLabel !== 'Bargain' && (
              <Text variant="titleLarge">Create Proposal</Text>
            )}
          </View>
          <ProposalForm
            onCancel={close}
            buttonLabel={buttonLabel}
            relatedObjId={relatedObjId}
            onSuccess={onSuccess}
          />
        </Modal>
      </Portal>
    </>
  )
}

const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
})

export default ProposalFormContainer