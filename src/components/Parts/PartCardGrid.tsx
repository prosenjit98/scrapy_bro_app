import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Card, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { part_details } from '@/constants'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '@/types/navigation'
import FastImage from 'react-native-fast-image'
import { useThemeStore } from '@/stores/themeStore'
import { AppTheme } from '@/theme'
import Icon from '@react-native-vector-icons/material-design-icons'

export const PartCardGrid = ({ item, userView = false }: { item: Part; userView?: boolean }) => {
  const theme = useThemeStore().theme
  const { colors } = theme
  //@ts-ignore
  const styles = makeStyles(colors)
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Root'>>()

  const imageUrl = item.images?.[0]
    ? typeof item.images[0] === 'string'
      ? item.images[0]
      : (item.images[0] as any)?.file?.url ?? (item.images[0] as any)?.url
    : null

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate(part_details as any, { partId: item.id })}
        style={styles.card}
      >
        {/* Image Section - Aspect Square */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <FastImage
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Icon name="image-off" size={40} color="#d1d5db" />
            </View>
          )}

          {/* Condition Badge - Top Left */}
          {item.condition && (
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionBadgeText}>{item.condition}</Text>
            </View>
          )}

          {/* Negotiable Badge - Top Right */}
          {!item.isNegotiable && (
            <View style={styles.negotiableBadge}>
              <Text style={styles.negotiableBadgeText}>Negotiable</Text>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title} numberOfLines={1}>{item.name} </Text>

          {/* Category */}
          <Text style={styles.category} numberOfLines={1}>Parts & Accessories</Text>

          {/* Price */}
          <Text style={styles.price}>₹{item.price?.toLocaleString?.() || item.price}</Text>

          {/* Location & Rating Row */}
          <View style={styles.infoRow}>
            <View style={styles.locationInfo}>
              <Icon name="map-marker" size={12} color="#999" />
              <Text
                style={styles.location}
                numberOfLines={1}
              >
                {item.vendor?.location || 'Unknown'}
              </Text>
            </View>
            <View style={styles.ratingInfo}>
              <Icon name="star" size={12} color="#fbbf24" />
              <Text style={styles.rating}>4.8</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Vendor Name */}
          <Text
            style={styles.vendorName}
            numberOfLines={1}
          >
            {item.vendor?.fullName || 'Vendor'}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  )
}

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#f3f4f6',
      overflow: 'hidden',
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      aspectRatio: 1,
      backgroundColor: '#f3f4f6',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    placeholderImage: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    conditionBadge: {
      position: 'absolute',
      top: 8,
      left: 8,
      backgroundColor: 'rgba(255,255,255,0.9)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      // backdropFilter: 'blur(4px)',
    },
    conditionBadgeText: {
      fontSize: 11,
      fontWeight: '600',
      color: '#333',
    },
    negotiableBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: '#10b981',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    negotiableBadgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#fff',
    },
    content: {
      padding: 12,
    },
    title: {
      fontSize: 14,
      fontWeight: '700',
      color: '#111',
      marginBottom: 4,
    },
    category: {
      fontSize: 12,
      color: '#999',
      marginBottom: 8,
    },
    price: {
      fontSize: 18,
      fontWeight: '800',
      color: '#4f46e5',
      marginBottom: 8,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    locationInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      flex: 1,
    },
    location: {
      fontSize: 11,
      color: '#666',
      flex: 1,
    },
    ratingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    rating: {
      fontSize: 11,
      color: '#666',
      fontWeight: '600',
    },
    divider: {
      height: 1,
      backgroundColor: '#f3f4f6',
      marginVertical: 8,
    },
    vendorName: {
      fontSize: 12,
      color: '#999',
    },
  })

export default PartCardGrid
