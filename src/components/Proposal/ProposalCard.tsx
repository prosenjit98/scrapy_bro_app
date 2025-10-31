import { View, Text } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper'
import { useThemeStore } from '@/stores/themeStore'

const ProposalCard: React.FC<{ item: Proposal }> = ({ item }) => {
  const { colors } = useThemeStore().theme
  return (
    <Card style={{ margin: 8, borderRadius: 10 }}>
      <Card.Content>
        <Text style={{ fontWeight: '600', fontSize: 16 }}>{item.proposer.fullName}</Text>
        <Text style={{ color: colors.mutedText, marginVertical: 4 }}>
          {item.description || 'No message provided'}
        </Text>
        <Text style={{ fontWeight: 'bold', color: '#2a9d8f' }}>₹ {item.price}</Text>
      </Card.Content>
    </Card>
  )
}

export default ProposalCard