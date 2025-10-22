import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import * as strings from '@/constants';
import { AppTheme } from '@/theme';
import { RootStackParamList } from '@/types/navigation';
import Icons from '@react-native-vector-icons/material-design-icons';
import { useThemeStore } from '@/stores/themeStore';
import MyLayout from '@/components/MyLayout';
import { useProfile } from '@/stores/hooks/useProfile';

const ProfileView = () => {
  const { colors } = useThemeStore().theme;
  // @ts-ignore
  const styles = makeStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Root'>>();
  const { profileQuery } = useProfile()
  const { data: profile } = profileQuery()
  console.log("profile", profile)

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.heading}>
          <View style={styles.headerContainer}>
            <Icons name={'face-man'} size={24} style={{ paddingRight: 5 }} color={colors.text} />
            <Text style={styles.subText}>Personal Details</Text>
          </View>
          <IconButton
            icon={props => <Icons name="pencil" {...props} size={20} />}
            size={10}
            iconColor={colors.text}
            style={styles.imageEdit}
            onPress={() => navigation.navigate(strings.profile_edit, { type: 'personal_info' })}
          />
        </View>
        <Card>
          <Card.Content>
            <View style={styles.row}>
              <Text style={styles.header}>Name</Text>
              <Text style={styles.subText}>{profile?.fullName ?? 'NA'}</Text>
            </View>
            <View style={[styles.row, { marginTop: 15 }]}>
              <Text style={styles.header}>Personal Email</Text>
              <Text style={styles.subText}>{profile?.email ?? 'NA'}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
              <View style={{ width: '50%' }}>
                <Text style={styles.header}>Mobile</Text>
                <Text style={styles.subText}>{profile?.phoneNumber ?? 'NA'}</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={styles.header}>Date of birth</Text>
                <Text style={styles.subText}>{'NA'}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={[styles.heading, { marginTop: 35 }]}>
          <View style={styles.headerContainer}>
            <Icons name={'home-city'} size={18} style={{ paddingRight: 5 }} color={colors.text} />
            <Text style={styles.subText}>Addresses</Text>
          </View>
        </View>
        <Card>
          <Card.Content>
            <View style={styles.row}>
              <View style={styles.otherHeader}>
                <Text style={styles.header}>Permanent address</Text>
              </View>
              <Text style={styles.subText}>{`${profile?.address}`}</Text>
            </View>
          </Card.Content>
        </Card>
        <View style={{ height: 20 }} />
      </View>
    </View>
  );
};

export default ProfileView;

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: { flex: 1 },
    headerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    imageEdit: { padding: 0, margin: 2 },
    row: {},
    subText: { fontSize: 16, color: colors.text, fontWeight: 'bold' },
    header: { fontSize: 15, color: colors.mutedText },
    otherHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    heading: { marginHorizontal: 10, marginVertical: 8, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between' },
  });
