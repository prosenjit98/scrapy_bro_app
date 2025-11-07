import { View, Text, Button } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper'
import { useThemeStore } from '@/stores/themeStore'
import Row from '../Row'

const ProposalCard: React.FC<{ item: Proposal, actionButton: any }> = ({ item, actionButton }) => {
  const { colors } = useThemeStore().theme
  console.log(item.isAccepted === null)
  return (
    <Card style={{ margin: 8, borderRadius: 10 }}>
      <Card.Content>
        <Row>
          <Text style={{ fontWeight: '600', fontSize: 16 }}>{item.proposer.fullName}</Text>
          <Text style={{ fontWeight: '600', fontSize: 10, alignSelf: 'center', borderRadius: 4, marginLeft: 8, color: colors.primary, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: item.isAccepted === null ? colors.mutedText : item.isAccepted ? colors.primaryContainer : colors.error }}>{item.isAccepted === null ? 'Pending' : item.isAccepted ? 'Accepted' : 'Rejected'}</Text>
        </Row>
        <Text style={{ color: colors.mutedText, marginVertical: 4 }}>
          {item.description || 'No message provided'}
        </Text>
        <Text style={{ fontWeight: 'bold', color: '#2a9d8f' }}>₹ {item.price}</Text>
        {actionButton && actionButton()}
      </Card.Content>
    </Card>
  )
}

export default ProposalCard