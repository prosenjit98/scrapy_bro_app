import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native'
import React from 'react'
import { LinearGradient } from 'react-native-linear-gradient'
import { useThemeStore } from '@/stores/themeStore';
import { Text, IconButton } from 'react-native-paper';
import Row from './Row';
import { RootStackParamList } from '@/types/navigation';
import Icons from '@react-native-vector-icons/material-design-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';



const MyNewHeader: React.FC<ViewProps & { withBackButton?: boolean; title?: string, subtitle?: string }> = props => {
  const theme = useThemeStore().theme;
  const { colors } = theme;
  //@ts-ignore
  const styles = makeStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Root'>>();
  return (
    <LinearGradient
      colors={['#4f46e5', '#9333ea']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.headerSection}
    >
      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Row>
          {props.withBackButton && <IconButton icon={() => <Icons size={25} name={'keyboard-backspace'} style={styles.navigationIcon} />} onPress={() => navigation.goBack()} />}
          <View>
            <Text style={styles.headerTitle}>{props.title}</Text>
            <Text style={styles.headerSubtitle}>{props.subtitle}</Text>
          </View>
        </Row>
        <TouchableOpacity style={styles.notificationButton}>
          <Icons name="bell" size={24} color="#fff" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </Row>
    </LinearGradient>
  )
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    headerSection: {
      paddingHorizontal: 8,
      paddingTop: 40,
      paddingBottom: 62,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerTitle: {
      color: colors.onPrimary,
      fontSize: 24,
      fontWeight: 'bold',
    },
    headerSubtitle: {
      color: colors.onPrimary,
      fontSize: 14,
      marginTop: 4,
    },
    navigationIcon: {
      color: colors.onPrimary
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
  });


export default MyNewHeader;