

import { View } from 'react-native'
import React from 'react'
import { Card, Text } from 'react-native-paper'
import { useThemeStore } from '@/stores/themeStore'
import Row from '../Row'

const BargainingCard: React.FC<{ item: Proposal, actionButton?: any }> = ({ item, actionButton }) => {
  const { colors } = useThemeStore().theme

  return (
    <Card style={{ margin: 8, borderRadius: 10 }}>
      <Card.Content>
        <Row>
          <Row style={{ alignItems: 'center' }}>
            <Text style={{ fontWeight: '500', fontSize: 14, marginRight: 8 }}>Product willing to buy :</Text>
            <Text style={{ fontWeight: '600', fontSize: 16, color: colors.primary }}>{item.part?.name}</Text>
          </Row>
        </Row>

        <Row style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: '500', fontSize: 14, marginRight: 8 }}>Model :</Text>
          <Text style={{ fontWeight: '600', fontSize: 16, color: colors.primary }}>{item.part?.model?.name}</Text>
        </Row>
        <Row style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: '500', fontSize: 14, marginRight: 8 }}>Company :</Text>
          <Text style={{ fontWeight: '600', fontSize: 16, color: colors.primary }}>{item.part?.make?.name}</Text>
        </Row>
        <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 14, marginTop: 8 }}>Your Proposal</Text>
          <Text style={{ fontWeight: '600', fontSize: 10, alignSelf: 'center', borderRadius: 4, marginLeft: 8, color: !item.isSelfAccepted ? "#fff" : colors.primary, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: item.isSelfAccepted === null ? colors.mutedText : item.isSelfAccepted ? colors.primaryContainer : colors.error }}>{item.isSelfAccepted === null ? 'Pending' : item.isSelfAccepted ? 'Accepted' : 'Rejected'}</Text>
        </Row>

        <View style={{ backgroundColor: colors.outlineVariant, marginBottom: 8, padding: 4, borderRadius: 8 }} >
          <Text style={{ color: colors.primary, marginVertical: 8 }}>
            {item.description || 'No message provided'}
          </Text>
        </View>
        <Row style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: '600', fontSize: 16 }}>Proposed Per Unit Price: </Text>
          <Text style={{ fontWeight: 'bold', color: '#2a9d8f', fontSize: 20 }}>₹ {item.price}</Text>
        </Row>
        {actionButton && actionButton()}
      </Card.Content>
    </Card>
  )
}

export default BargainingCard
