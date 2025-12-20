// src/screens/parts/PartDetailsScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { useGetPartDetails } from '@/stores/hooks/useParts';
import MyLayout from '@/components/MyLayout';
import CreateOrderModal from '@/components/Order/CreateOrderModal';
import { useCreateOrder } from '@/stores/hooks/useOrders';
import ProposalFormContainer from '@/components/Proposal/ProposalFormContainer';

export default function PartDetailsScreen() {
  const { params } = useRoute<any>();
  const { data: part, isLoading } = useGetPartDetails(params.partId);
  const [orderModalVisible, setOrderModalVisible] = useState(false);

  // create order hook (support mutate or mutateAsync shapes)
  const createOrderHook: any = useCreateOrder();
  const createOrder = createOrderHook?.mutate;
  const createOrderAsync = createOrderHook?.mutateAsync;
  const creatingOrder = createOrderHook?.isPending ?? createOrderHook?.isLoading ?? false;

  // determine image URL safely: images may be strings or objects with a file.url
  const firstImage = part?.images?.[0]
  const imageUrl = firstImage
    ? typeof firstImage === 'string'
      ? firstImage
      : (firstImage as any)?.file?.url ?? (firstImage as any)?.url
    : null;

  if (isLoading) return <Text>Loading...</Text>;
  if (!part) return <Text>No Part Found</Text>;

  const openOrderModal = () => setOrderModalVisible(true);
  const closeOrderModal = () => setOrderModalVisible(false);

  const createOrderHandler = async (payload: any) => {
    // payload: { proposalId?, vendorId?, userId, totalPrice, quantity, unitPrice? }
    try {
      if (createOrderAsync) {
        await createOrderAsync(payload);
        closeOrderModal();
        return;
      }
      if (createOrder) {
        createOrder(payload, { onSuccess: () => closeOrderModal() });
        return;
      }
      // fallback: no-op
      closeOrderModal();
    } catch (e) {
      // keep simple: close modal on error handling is up to hook/parent
      // you can extend to show snackbar on error
      console.warn('Create order failed', e);
    }
  };

  return (
    <MyLayout withBackButton={true} hasProfileLink={true} moduleName="Part Details" rendering={isLoading}>
      <Card>
        <Card.Cover source={{ uri: imageUrl }} />
        <Card.Content>
          <Text variant="titleLarge">{part.name}</Text>
          <Text variant="bodyMedium" style={{ color: '#888' }}>
            Posted by {part.vendor.fullName}
          </Text>
          <Divider style={{ marginVertical: 10 }} />
          <Text variant="bodyLarge">{part.description}</Text>
          <Divider style={{ marginVertical: 10 }} />
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={styles.key}>Price</Text>
              <Text style={styles.value}>₹{part.price}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.key}>Condition</Text>
              <Text style={styles.value}>{part.condition}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.key}>Stock Available</Text>
              <Text style={styles.value}>{part.stock}</Text>
            </View>
            <View style={[styles.row]}>
              <Text style={styles.key}>Available</Text>
              <Text style={styles.value}>{part.isAvailable ? 'Yes' : 'No'}</Text>
            </View>
            <View style={[styles.row]}>
              <Text style={styles.key}>Company</Text>
              <Text style={styles.value}>{part.make.name}</Text>
            </View>
            <View style={[styles.row, styles.noBorder]}>
              <Text style={styles.key}>Model</Text>
              <Text style={styles.value}>{part.model.name}</Text>
            </View>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" style={{ flex: 1, marginRight: 8 }} onPress={openOrderModal}>
            Order Now
          </Button>
          <ProposalFormContainer mode="contained" style={{ flex: 1 }} buttonLabel='Bargain' />
        </Card.Actions>
      </Card>

      <CreateOrderModal
        visible={orderModalVisible}
        onDismiss={closeOrderModal}
        defaultValues={{
          vendorId: part.vendor?.id,
          quantity: '1',
          unitPrice: part.price ? String(part.price) : undefined,
        }}
        onSubmit={createOrderHandler}
        loading={creatingOrder}
      />
    </MyLayout>
  );
}

const styles = StyleSheet.create({
  table: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  key: {
    color: '#666',
    fontSize: 14,
  },
  value: {
    color: '#222',
    fontSize: 14,
    fontWeight: '600',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
});
