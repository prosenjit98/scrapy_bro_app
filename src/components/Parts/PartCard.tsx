import React, { useState } from 'react'
import { View, TouchableOpacity, FlatList, ViewStyle } from 'react-native'
import { Avatar, Card, Text, Button, useTheme, IconButton } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { bargaining, manage_bargaining, part_create, part_details, proposal_form } from '@/constants'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '@/types/navigation'
import FastImage from 'react-native-fast-image'
import { useThemeStore } from '@/stores/themeStore'
import Row from '../Row'
import CreateOrderModal from '@/components/Order/CreateOrderModal'
import { useCreateOrder } from '@/stores/hooks/useOrders'
import { useAuthStore } from '@/stores/authStore'
import ProposalFormContainer from '../Proposal/ProposalFormContainer'

export const PartCard = ({ item, userView = false }: { item: Part, userView?: boolean }) => {
  const theme = useThemeStore().theme
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Root'>>()
  const [orderModalVisible, setOrderModalVisible] = useState(false)
  const user = useAuthStore((s) => s.user);

  // create order hook (supports mutate / mutateAsync)
  const createOrderHook: any = useCreateOrder()
  const createOrder = createOrderHook?.mutate
  const createOrderAsync = createOrderHook?.mutateAsync
  const creatingOrder = createOrderHook?.isPending ?? createOrderHook?.isLoading ?? false

  const renderImages = (images: string[]) => {
    const displayImages = images.slice(0, 4)
    const imageCount = displayImages.length
    const gridTemplate: ViewStyle =
      imageCount === 1
        ? { height: 250 }
        : imageCount === 2
          ? { flexDirection: 'row', height: 200 }
          : { flexDirection: 'row', flexWrap: 'wrap', height: 250 }

    return (
      <View style={[{ marginTop: 8, borderRadius: 12, overflow: 'hidden' }, gridTemplate]}>
        {displayImages.map((file, index) => {
          const url =
            typeof file === 'string'
              ? file
              : (file as any)?.file?.url ?? (file as any)?.url;

          return (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate(part_details, { partId: item.id })
              }
              style={{
                flexBasis: imageCount === 1 ? '100%' : imageCount === 2 ? '50%' : '50%',
                height: imageCount === 1 ? '100%' : 125,
              }}
            >
              <FastImage
                source={{ uri: url }}
                style={{ width: '100%', height: '100%' }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
          )
        })}
        {images.length > 4 && (
          <View
            style={{
              position: 'absolute',
              right: 10,
              bottom: 10,
              backgroundColor: 'rgba(0,0,0,0.6)',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff' }}>+{images.length - 4}</Text>
          </View>
        )}
      </View>
    )
  }

  return (
    <Card
      style={{
        marginVertical: 10,
        borderRadius: 12,
        elevation: 2,
        backgroundColor: theme.colors.surface,
      }}
    >
      <Card.Content>
        {/* Vendor Info */}
        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Avatar.Image
              size={40}
              source={{ uri: item.vendor?.avatar || 'https://placekitten.com/200/200' }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text variant="titleMedium">{item?.vendor?.fullName}</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                {item.vendor?.location || 'Unknown'}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {!userView && <IconButton icon="pencil" size={18} onPress={() => navigation.navigate(part_create, { partId: item.id })} />}
            {/* {onDelete && <IconButton icon="delete" size={18} onPress={onDelete} />} */}
          </View>
        </Row>


        {/* Description */}
        <Text variant="bodyLarge" style={{ marginBottom: 6 }}>
          {item.name}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
          {item.description}
        </Text>

        {/* Images */}
        {item.images && item.images?.length > 0 && renderImages(item.images)}

        {/* Price + Actions */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 10,
          }}
        >
          <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
            ₹ {item.price}
          </Text>

          {userView && <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button
              mode="contained"
              onPress={() => setOrderModalVisible(true)}
            >
              Order
            </Button>
            <ProposalFormContainer mode="outlined" buttonLabel='Bargain' relatedObjId={item.id} onSuccessNavigation={() => navigation.navigate('Bargains' as any)} />
          </View>}
        </View>
      </Card.Content>

      <CreateOrderModal
        visible={orderModalVisible}
        onDismiss={() => setOrderModalVisible(false)}
        defaultValues={{
          vendorId: item.vendor?.id,
          quantity: '1',
          unitPrice: item.price ? String(item.price) : undefined,
        }}
        loading={creatingOrder}
        onSubmit={async (payload: any) => {
          try {
            if (createOrderAsync) {
              await createOrderAsync(payload)
              setOrderModalVisible(false)
              return
            }
            if (createOrder) {
              createOrder(payload, { onSuccess: () => setOrderModalVisible(false) })
              return
            }
            setOrderModalVisible(false)
          } catch (e) {
            console.warn('Create order failed', e)
          }
        }}
      />

    </Card>
  )
}

export default PartCard
