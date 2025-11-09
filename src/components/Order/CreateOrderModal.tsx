import React, { useEffect, useState } from 'react'
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useAuthStore } from '@/stores/authStore'

type CreateOrderForm = {
  proposalId?: string
  vendorId?: number
  price?: string
  quantity?: string
  unitPrice?: string
}

type Props = {
  visible: boolean
  onDismiss: () => void
  defaultValues?: Partial<CreateOrderForm>
  onSubmit: (payload: {
    proposalId?: string
    vendorId?: number
    userId: number | undefined
    totalPrice: number
    quantity: number
    unitPrice?: number
  }) => Promise<any> | void
  loading?: boolean
  title?: string
}

const CreateOrderModal = ({ visible, onDismiss, defaultValues = {}, onSubmit, loading = false, title = 'Create Order' }: Props) => {
  const { user } = useAuthStore()
  const [proposalId, setProposalId] = useState(defaultValues.proposalId ?? '')
  const [vendorId, setVendorId] = useState(defaultValues.vendorId ? String(defaultValues.vendorId) : '')
  const [price, setPrice] = useState(defaultValues.price ?? '')
  const [quantity, setQuantity] = useState(defaultValues.quantity ?? '1')
  const [unitPrice, setUnitPrice] = useState(defaultValues.unitPrice ?? '')

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (visible) {
      setProposalId(defaultValues.proposalId ?? '')
      setVendorId(defaultValues.vendorId ? String(defaultValues.vendorId) : '')
      setPrice(defaultValues.price ?? '')
      setQuantity(defaultValues.quantity ?? '1')
      setUnitPrice(defaultValues.unitPrice ?? '')
      setError(null)
    }
  }, [visible, defaultValues])

  // compute total price whenever unitPrice or quantity change
  useEffect(() => {
    const parsedUnit = parseFloat(unitPrice || '')
    const parsedQty = parseInt(quantity || '', 10)

    if (!isNaN(parsedUnit) && !isNaN(parsedQty)) {
      // keep two decimals
      setPrice((parsedUnit * parsedQty).toFixed(2))
    } else {
      // if default price exists keep it, otherwise show empty/0.00
      if (!defaultValues.price) {
        setPrice('')
      }
    }
  }, [unitPrice, quantity, defaultValues.price])

  const handleConfirm = async () => {
    setError(null)
    const parsedPrice = parseFloat(price)
    const parsedQuantity = parseInt(quantity, 10)
    const parsedUnit = unitPrice ? parseFloat(unitPrice) : undefined
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Please enter a valid total price')
      return
    }
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError('Please enter a valid quantity')
      return
    }
    try {
      await onSubmit({
        proposalId: proposalId || undefined,
        vendorId: vendorId ? Number(vendorId) : undefined,
        userId: user?.id,
        totalPrice: parsedPrice,
        quantity: parsedQuantity,
        unitPrice: parsedUnit,
      })
      // keep closing decision to parent if they prefer; default to close on success
      onDismiss()
    } catch (e: any) {
      setError(e?.message || 'Failed to create order')
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>

          {/* <Text style={styles.label}>Proposal ID (optional)</Text>
          <TextInput value={proposalId} onChangeText={setProposalId} placeholder="proposal id" style={styles.input} />

          <Text style={styles.label}>Vendor ID (optional)</Text>
          <TextInput value={vendorId} onChangeText={setVendorId} placeholder="vendor id" style={styles.input} keyboardType="numeric" /> */}

          <Text style={styles.label}>Total Price</Text>
          <TextInput
            value={price ? String(price) : ''}
            onChangeText={setPrice}
            placeholder="0.00"
            style={styles.input}
            keyboardType="numeric"
            editable={false} // make read-only since it's computed from unitPrice * quantity
          />

          <Text style={styles.label}>Quantity</Text>
          <TextInput value={quantity} onChangeText={setQuantity} placeholder="1" style={styles.input} keyboardType="numeric" />

          <Text style={styles.label}>Unit Price</Text>
          <TextInput value={unitPrice} onChangeText={setUnitPrice} placeholder="0.00" style={styles.input} keyboardType="numeric" />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.row}>
            <TouchableOpacity onPress={onDismiss} style={[styles.btn, styles.btnCancel]} disabled={loading}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleConfirm} style={[styles.btn, styles.btnConfirm]} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.btnText, { color: '#fff' }]}>Create</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '92%', backgroundColor: '#fff', borderRadius: 8, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 13, color: '#444', marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#e6e6e6', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, marginTop: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  btn: { flex: 1, paddingVertical: 10, marginHorizontal: 6, borderRadius: 6, alignItems: 'center' },
  btnCancel: { backgroundColor: '#f1f1f1' },
  btnConfirm: { backgroundColor: '#2a9d8f' },
  btnText: { color: '#333', fontWeight: '600' },
  error: { color: '#e63946', marginTop: 8, fontSize: 13 },
})

export default CreateOrderModal