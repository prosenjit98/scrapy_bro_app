import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import ProfileImage from '../../components/ProfileImage';
import { useAppTheme } from '../../theme';
import { RootStackParamList } from '../../types/Navigation';
import MyLayout from '@/components/MyLayout';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { profile_edit } from '@/constants';
import { useProfile } from '@/stores/hooks/useProfile';
import ProfileView from './ProfileView';

const ProfileScreen = () => {
  const theme = useAppTheme();
  const { colors } = theme;
  const [isFetching, setFetching] = React.useState(false);
  const styles = makeStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Profile'>>();
  const { profileQuery } = useProfile()
  const { refetch, isLoading } = profileQuery()


  return (
    <ScrollView style={styles.root} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />} >
      <ProfileView />
    </ScrollView>
  );
};

export default ProfileScreen;

const makeStyles = (_colors: any) =>
  StyleSheet.create({
    root: { flex: 1 },
    backgroundColor: _colors.background,
  });

