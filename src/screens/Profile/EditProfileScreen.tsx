import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/types/Navigation';
import { useThemeStore } from '@/stores/themeStore';
import { useProfile } from '@/stores/hooks/useProfile';
import ProfileEditScreen from './PersonalEditForm';
import AvatarUpdate from './AvatarUpdate';
import { AppTheme } from '@/theme';
import MyNewHeader from '@/components/MyNewHeader';

const EditProfileScreen = () => {
  const { bottom } = useSafeAreaInsets();

  const {
    params: { type },
  } = useRoute<RouteProp<RootStackParamList, 'EditProfile'>>();
  const { profileQuery } = useProfile();
  const { refetch, isFetching } = profileQuery();
  const theme = useThemeStore().theme;
  const { colors } = theme;
  //@ts-ignore
  const styles = makeStyles(colors);

  const getForm = () => {
    if (type === 'personal_info') return <ProfileEditScreen />;
    if (type === 'avatar') return <AvatarUpdate />;
  };

  return (
    <>
      {/* Header Section with Gradient */}

      <ScrollView
        keyboardShouldPersistTaps="always"
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        style={{ backgroundColor: colors.background, flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <MyNewHeader
          title="Edit Profile"
          subtitle="Manage your account"
          withBackButton={true}
        />
        <View style={{ marginBottom: bottom + 10, flex: 1 }}>{getForm()}</View>
      </ScrollView>
    </>
  );
};

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });

export default EditProfileScreen;
