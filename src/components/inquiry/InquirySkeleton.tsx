import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper'
import Row from '../Row'
import SkeletonBox from '../SkeletonBox'

const InquirySkeleton = () => {
  return (
    <Card style={styles.card}>
      <View style={{ padding: 16 }}>
        <Row>
          <SkeletonBox height={50} width={50} borderRadius={25} />
          <View style={{ paddingLeft: 10 }}>
            <SkeletonBox height={14} width={150} />
            <SkeletonBox height={10} width="50%" />
          </View>
        </Row>

        <SkeletonBox height={20} width="60%" />
        <SkeletonBox height={10} width="90%" />
        <View style={styles.imageGrid}>
          <SkeletonBox height={150} width="49%" />
          <SkeletonBox height={150} width="49%" />
          <SkeletonBox height={150} width="49%" />
          <SkeletonBox height={150} width="49%" />
        </View>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  }
})

export default InquirySkeleton