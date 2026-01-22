import { useThemeStore } from "@/stores/themeStore"
import { View, Modal, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput } from "react-native"
import { Text, Button } from "react-native-paper"
import Icon from '@react-native-vector-icons/material-design-icons'
import { AppTheme } from "@/theme"
import { useState } from "react"
import FastImage from "react-native-fast-image"


const RatingModal = ({ visible, order, onDismiss, onSubmit }: any) => {
  const { colors } = useThemeStore().theme
  //@ts-ignore
  const styles = makeStyles(colors)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Please select a rating')
      return
    }
    onSubmit({ rating, review, order })
    setRating(0)
    setReview('')
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Rate Vendor</Text>
              <Text style={styles.modalSubtitle}>{order?.vendor}</Text>
            </View>
            <TouchableOpacity onPress={onDismiss}>
              <Icon name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Product Info */}
            {order?.productImage && (
              <View style={styles.modalProductInfo}>
                <FastImage
                  source={{ uri: order?.productImage }}
                  style={styles.modalProductImage}
                  resizeMode="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalProductName} numberOfLines={2}>{order?.productName}</Text>
                  <Text style={styles.modalProductPrice}>₹{order?.totalPrice?.toFixed(2)}</Text>
                </View>
              </View>
            )}

            {/* Rating Stars */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>How would you rate this vendor?</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Icon
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={40}
                      color={star <= rating ? '#fbbf24' : '#d1d5db'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {rating > 0 && (
                <Text style={styles.ratingText}>
                  {rating === 5 ? 'Excellent!' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Below Average' : 'Poor'}
                </Text>
              )}
            </View>

            {/* Review Input */}
            <View style={styles.reviewSection}>
              <Text style={styles.reviewLabel}>Write a review (optional)</Text>
              <TextInput
                style={styles.reviewInput}
                placeholder="Share your experience with this vendor..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={review}
                onChangeText={setReview}
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <Button mode="contained" style={{ flex: 1 }} onPress={handleSubmit}>
              Submit Review
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default RatingModal

const makeStyles = (colors: AppTheme['colors']) => (
  StyleSheet.create(
    {
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
      modalProductInfo: {
        flexDirection: 'row',
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
      },
      modalProductImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
      },
      modalProductName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111',
        marginBottom: 4,
      },
      modalProductPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4f46e5',
      },
      ratingSection: {
        marginBottom: 24,
      },
      ratingLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111',
        marginBottom: 12,
      },
      starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 12,
      },
      ratingText: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
        color: '#4f46e5',
      },
      reviewLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111',
        marginBottom: 8,
      },
      reviewInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: '#111',
        textAlignVertical: 'top',
      },
      reviewSection: {
        marginBottom: 20,
      },
    })
)