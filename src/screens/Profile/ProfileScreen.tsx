import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
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
  const { refetch } = profileQuery()


  return (
    <MyLayout handleRefetch={refetch} rendering={isFetching} withBackButton={true} hasProfileLink={false} moduleName='Profile'>

      <View style={styles.root}>
        <View style={[styles.content, { marginBottom: 10 }]}>
          <View style={styles.ProfileD}>
            <View style={styles.imageContainer}>
              <ProfileImage size={80} />
              <IconButton
                icon={props => <MaterialDesignIcons name="pencil" {...props} size={16} />}
                size={10}
                iconColor="white"
                containerColor={colors.primary}
                style={styles.imageEdit}
                onPress={() => navigation.navigate(profile_edit, { type: 'avatar' })}
              />
            </View>
          </View>
          <ProfileView />
        </View>
      </View>
    </MyLayout>
  );
};

export default ProfileScreen;

const makeStyles = (_colors: MD3Colors) =>
  StyleSheet.create({
    root: { flex: 1, padding: 16, paddingTop: 0 },
    content: { borderRadius: 10, marginTop: 10, flex: 1 },
    container: { flex: 1, paddingTop: 20 },
    ProfileD: { alignItems: 'center', flexDirection: 'row', paddingBottom: 20, paddingTop: 20 },
    row: { paddingLeft: 10, paddingTop: 10 },
    imageContainer: { position: 'relative' },
    imageEdit: { position: 'absolute', bottom: 0, right: -10 },
  });

