import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useGetPartDetails } from '@/stores/hooks/useParts';
import FastImage from 'react-native-fast-image';
import { useThemeStore } from '@/stores/themeStore';
import { AppTheme } from '@/theme';
import Icon from '@react-native-vector-icons/material-design-icons';
import CreateOrderModal from '@/components/Order/CreateOrderModal';
import { useCreateOrder } from '@/stores/hooks/useOrders';
import LinearGradient from 'react-native-linear-gradient';
import { BuyNowModal } from '@/components/Order/BuyNowModal';
import { NoData } from '@/components/NoData';
import PartSkeleton from '@/components/Parts/PartSkeleton';
import ProposalFormContainer from '@/components/Proposal/ProposalFormContainer';

const { width } = Dimensions.get('window');

export default function PartDetailsScreen() {
  const navigation = useNavigation<any>();
  const { params } = useRoute<any>();
  const { data: part, isLoading } = useGetPartDetails(params.partId);
  const theme = useThemeStore().theme;
  const { colors } = theme;
  //@ts-ignore
  const styles = makeStyles(colors);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [buyNowModalVisible, setBuyNowModalVisible] = useState(false);


  const createOrderHook: any = useCreateOrder();
  const createOrderAsync = createOrderHook?.mutateAsync;
  const creatingOrder = createOrderHook?.isPending ?? createOrderHook?.isLoading ?? false;

  // Get all image URLs
  const imageUrls = (part?.images || []).map((img: any) =>
    typeof img === 'string' ? img : (img as any)?.file?.url ?? (img as any)?.url
  ).filter(Boolean);

  if (isLoading) return <PartSkeleton />;
  if (!part) return <NoData title="Part not found" description='Something went wrong' />;

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#e8edfc' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Image Slider */}
        <View style={styles.imageContainer}>
          {imageUrls.length > 0 ? (
            <FastImage
              source={{ uri: imageUrls[currentImageIndex] }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Icon name="image-off" size={60} color="#d1d5db" />
            </View>
          )}

          {/* Negotiable Badge */}
          {true && (
            <View style={styles.negotiableBadge}>
              <Text style={styles.negotiableBadgeText}>Negotiable</Text>
            </View>
          )}

          {/* Image Navigation Buttons */}
          {imageUrls.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonLeft]}
                onPress={handlePreviousImage}
              >
                <Icon name="chevron-left" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonRight]}
                onPress={handleNextImage}
              >
                <Icon name="chevron-right" size={24} color="#333" />
              </TouchableOpacity>

              {/* Image Indicators */}
              <View style={styles.indicatorsContainer}>
                {imageUrls.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setCurrentImageIndex(index)}
                    style={[
                      styles.indicator,
                      index === currentImageIndex && styles.indicatorActive,
                    ]}
                  />
                ))}
              </View>
            </>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          {/* Title & Price */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{part.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{part.price?.toLocaleString?.() || part.price}</Text>
              <View style={styles.conditionBadge}>
                <Text style={styles.conditionText}>{part.condition}</Text>
              </View>
            </View>
          </View>

          {/* Quick Info Grid */}
          <View style={styles.quickInfoGrid}>
            <View style={styles.quickInfoCard}>
              <View style={styles.quickInfoHeader}>
                <Icon name="package" size={16} color="#666" />
                <Text style={styles.quickInfoLabel}>Category</Text>
              </View>
              <Text style={styles.quickInfoValue}>Parts & Accessories</Text>
            </View>
            <View style={styles.quickInfoCard}>
              <View style={styles.quickInfoHeader}>
                <Icon name="map-marker" size={16} color="#666" />
                <Text style={styles.quickInfoLabel}>Location</Text>
              </View>
              <Text style={styles.quickInfoValue}>{part.vendor?.location || 'Unknown'}</Text>
            </View>
          </View>

          {/* Vendor Info Card */}
          <LinearGradient style={styles.vendorCard} colors={['#eecef9', '#f9ecfe']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <View style={styles.vendorHeader}>
              <View>
                <View style={styles.vendorNameRow}>
                  <Text style={styles.vendorName}>{part.vendor?.fullName}</Text>
                  <Icon name="check-decagram" size={18} color="#4f46e5" />
                </View>
                <View style={styles.vendorRating}>
                  <Icon name="star" size={14} color="#fbbf24" />
                  <Text style={styles.ratingText}>4.8 Rating</Text>
                </View>
              </View>
              <Button mode="outlined" onPress={() => { }}>
                View Profile
              </Button>
            </View>
          </LinearGradient>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {part.description || 'No description provided'}
            </Text>
          </View>

          {/* Details Table */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableKey}>Condition</Text>
                <Text style={styles.tableValue}>{part.condition}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableKey}>Stock Available</Text>
                <Text style={styles.tableValue}>{part.stock}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableKey}>Make</Text>
                <Text style={styles.tableValue}>{part.make?.name || 'N/A'}</Text>
              </View>
              <View style={[styles.tableRow, styles.tableRowLast]}>
                <Text style={styles.tableKey}>Model</Text>
                <Text style={styles.tableValue}>{part.model?.name || 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* Spacing for bottom buttons */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <Button
          mode="contained"
          style={styles.buyButton}
          onPress={() => setBuyNowModalVisible(true)}
        >
          Buy Now
        </Button>
        <ProposalFormContainer mode="outlined" buttonLabel='Bargain' relatedObjId={part.id} onSuccessNavigation={() => navigation.navigate('Bargains' as any)} style={styles.negotiateButton} />
      </View>

      {/* Buy Now Modal */}
      <BuyNowModal
        visible={buyNowModalVisible}
        onDismiss={() => setBuyNowModalVisible(false)}
        onOrderSuccess={() => setBuyNowModalVisible(false)}
        product={part}
        createOrderAsync={createOrderAsync}
        loading={creatingOrder}
      />
    </View>
  );
}

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
      backgroundColor: '#fff',
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f3f4f6',
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111',
    },
    imageContainer: {
      width: '100%',
      aspectRatio: 1,
      backgroundColor: '#f3f4f6',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    placeholderImage: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    negotiableBadge: {
      position: 'absolute',
      top: 16,
      right: 16,
      backgroundColor: '#10b981',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    negotiableBadgeText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 13,
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    navButtonLeft: {
      left: 16,
    },
    navButtonRight: {
      right: 16,
    },
    indicatorsContainer: {
      position: 'absolute',
      bottom: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      gap: 6,
    },
    indicator: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: 'rgba(255,255,255,0.5)',
    },
    indicatorActive: {
      width: 24,
      backgroundColor: '#fff',
    },
    content: {
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    titleSection: {
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: '#111',
      marginBottom: 12,
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    price: {
      fontSize: 28,
      fontWeight: '800',
      color: '#4f46e5',
    },
    conditionBadge: {
      backgroundColor: '#c5cabb',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    conditionText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#4f46e5',
    },
    quickInfoGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    quickInfoCard: {
      flex: 1,
      backgroundColor: '#f9fafb',
      borderRadius: 12,
      padding: 12,
    },
    quickInfoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8,
    },
    quickInfoLabel: {
      fontSize: 11,
      color: '#666',
      fontWeight: '500',
    },
    quickInfoValue: {
      fontSize: 13,
      fontWeight: '600',
      color: '#111',
    },
    vendorCard: {
      backgroundColor: '#eef2ff',
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
    },
    vendorHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    vendorNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
    },
    vendorName: {
      fontSize: 15,
      fontWeight: '600',
      color: '#111',
    },
    vendorRating: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    ratingText: {
      fontSize: 13,
      fontWeight: '500',
      color: '#333',
    },
    descriptionSection: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: '#111',
      marginBottom: 8,
    },
    descriptionText: {
      fontSize: 13,
      color: '#666',
      lineHeight: 20,
    },
    detailsSection: {
      marginBottom: 20,
    },
    table: {
      backgroundColor: '#f9fafb',
      borderRadius: 12,
      overflow: 'hidden',
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
    },
    tableRowLast: {
      borderBottomWidth: 0,
    },
    tableKey: {
      fontSize: 13,
      color: '#666',
    },
    tableValue: {
      fontSize: 13,
      fontWeight: '600',
      color: '#111',
    },
    bottomActions: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingBottom: 20,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#f3f4f6',
    },
    buyButton: {
      flex: 1,
    },
    negotiateButton: {
      flex: 1,
    },
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
    productSummary: {
      flexDirection: 'row',
      backgroundColor: '#f9fafb',
      borderRadius: 12,
      padding: 12,
      marginBottom: 20,
      gap: 12,
    },
    summaryImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
    },
    summaryTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: '#111',
      marginBottom: 4,
    },
    summaryVendor: {
      fontSize: 12,
      color: '#666',
      marginBottom: 4,
    },
    summaryPrice: {
      fontSize: 14,
      fontWeight: '700',
      color: '#4f46e5',
    },
    modalSection: {
      marginBottom: 20,
    },
    modalSectionTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: '#111',
      marginBottom: 12,
    },
    paymentButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    paymentButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: '#f3f4f6',
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
    paymentButtonActive: {
      backgroundColor: '#4f46e5',
      borderColor: '#4f46e5',
    },
    paymentButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
    },
    paymentButtonTextActive: {
      color: '#fff',
    },
    addressInput: {
      borderWidth: 1,
      borderColor: '#d1d5db',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: '#111',
      textAlignVertical: 'top',
      fontSize: 13,
    },
    orderSummary: {
      backgroundColor: '#eef2ff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    summaryHeader: {
      fontSize: 14,
      fontWeight: '600',
      color: '#111',
      marginBottom: 12,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: 12,
      color: '#666',
    },
    summaryValue: {
      fontSize: 12,
      fontWeight: '500',
      color: '#111',
    },
    summaryDivider: {
      height: 1,
      backgroundColor: '#d1d5db',
      marginVertical: 8,
    },
    summaryTotal: {
      fontSize: 14,
      fontWeight: '700',
      color: '#111',
    },
    summaryTotalValue: {
      fontSize: 16,
      fontWeight: '800',
      color: '#4f46e5',
    },
    modalFooter: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: '#f3f4f6',
      backgroundColor: '#fff',
    },
  });
//           <Text variant="titleLarge">{part.name}</Text>
//           <Text variant="bodyMedium" style={{ color: '#888' }}>
//             Posted by {part.vendor.fullName}
//           </Text>
//           <Divider style={{ marginVertical: 10 }} />
//           <Text variant="bodyLarge">{part.description}</Text>
//           <Divider style={{ marginVertical: 10 }} />
//           <View style={styles.table}>
//             <View style={styles.row}>
//               <Text style={styles.key}>Price</Text>
//               <Text style={styles.value}>₹{part.price}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.key}>Condition</Text>
//               <Text style={styles.value}>{part.condition}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.key}>Stock Available</Text>
//               <Text style={styles.value}>{part.stock}</Text>
//             </View>
//             <View style={[styles.row]}>
//               <Text style={styles.key}>Available</Text>
//               <Text style={styles.value}>{part.isAvailable ? 'Yes' : 'No'}</Text>
//             </View>
//             <View style={[styles.row]}>
//               <Text style={styles.key}>Company</Text>
//               <Text style={styles.value}>{part.make.name}</Text>
//             </View>
//             <View style={[styles.row, styles.noBorder]}>
//               <Text style={styles.key}>Model</Text>
//               <Text style={styles.value}>{part.model.name}</Text>
//             </View>
//           </View>
//         </Card.Content >
//   <Card.Actions>
//     <Button mode="contained" style={{ flex: 1, marginRight: 8 }} onPress={openOrderModal}>
//       Order Now
//     </Button>
//     <ProposalFormContainer mode="contained" style={{ flex: 1 }} buttonLabel='Bargain' />
//   </Card.Actions>
//       </Card >

//   <CreateOrderModal
//     visible={orderModalVisible}
//     onDismiss={closeOrderModal}
//     defaultValues={{
//       vendorId: part.vendor?.id,
//       quantity: '1',
//       unitPrice: part.price ? String(part.price) : undefined,
//     }}
//     onSubmit={createOrderHandler}
//     loading={creatingOrder}
//   />
//     </MyLayout >
//   );
// }

// const styles = StyleSheet.create({
//   table: {
//     marginTop: 8,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#eee',
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f1f1',
//   },
//   key: {
//     color: '#666',
//     fontSize: 14,
//   },
//   value: {
//     color: '#222',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   noBorder: {
//     borderBottomWidth: 0,
//   },
// });
