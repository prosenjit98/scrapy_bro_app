import React, { useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { vendor_root } from '@/constants';
import Icon from '@react-native-vector-icons/material-design-icons';
import { AppTheme } from '@/theme';
import { useGetParts } from '@/stores/hooks/useParts';
import PartCardGrid from '@/components/Parts/PartCardGrid';
import PartSkeleton from '@/components/Parts/PartSkeleton';
import LinearGradient from 'react-native-linear-gradient';

const categories = ['Electronics', 'Furniture', 'Sports', 'Fashion', 'Books'];

export default function HomeScreen({ navigation }: any) {
  const user = useAuthStore((s) => s.user);
  const theme = useThemeStore().theme;
  const { colors } = theme;
  //@ts-ignore
  const styles = makeStyles(colors);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: partObject, isLoading } = useGetParts();
  const { data: parts = [] } = partObject || {};

  const featuredParts = parts.slice(0, 6);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header with Gradient */}
      <LinearGradient style={styles.headerGradient} colors={['#4f46e5', '#9333ea']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Scrapy</Text>
            <Text style={styles.headerSubtitle}>Find amazing deals</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="bell" size={24} color="#fff" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#999"
          />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="tag" size={20} color="#333" />
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithSeeAll}>
            <View style={styles.sectionHeader}>
              <Icon name="trending-up" size={20} color="#333" />
              <Text style={styles.sectionTitle}>Featured Products</Text>
            </View>
            {/* <TouchableOpacity onPress={() => navigation.navigate('PartsList' as any)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity> */}
          </View>

          {isLoading ? (
            <PartSkeleton />
          ) : (
            <View style={styles.productsGrid}>
              {featuredParts.map((part: Part) => (
                <View key={part.id} style={styles.gridItem}>
                  <PartCardGrid item={part} userView={true} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Vendor FAB */}
      {user && user.role === 'vendor' && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate(vendor_root)}
        />
      )}
    </View>
  );
}

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    headerGradient: {
      paddingHorizontal: 16,
      paddingTop: 40,
      paddingBottom: 20,
      backgroundColor: '#4f46e5',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#fff',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 13,
      color: '#c7d2fe',
    },
    notificationButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationBadge: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#ef4444',
      position: 'absolute',
      top: 8,
      right: 8,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 16,
      paddingHorizontal: 12,
      height: 44,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      color: '#111',
      fontSize: 15,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionHeaderWithSeeAll: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111',
      marginLeft: 8,
    },
    seeAllText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#4f46e5',
    },
    categoriesScroll: {
      flexGrow: 0,
    },
    categoriesContent: {
      gap: 8,
    },
    categoryButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    categoryButtonActive: {
      backgroundColor: '#4f46e5',
      borderColor: '#4f46e5',
    },
    categoryButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#333',
    },
    categoryButtonTextActive: {
      color: '#fff',
    },
    productsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    gridItem: {
      width: '48%',
    },
    fab: {
      position: 'absolute',
      right: 16,
      bottom: 16,
      backgroundColor: '#4f46e5',
    },
  });
