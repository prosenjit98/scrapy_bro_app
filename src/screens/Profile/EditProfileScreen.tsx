import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/types/Navigation';
import { useThemeStore } from '@/stores/themeStore';
import MyHeader from '@/components/MyHeader';
import { useProfile } from '@/stores/hooks/useProfile';
import ProfileEditScreen from './PersonalEditForm';
import AvatarUpdate from './AvatarUpdate';


const EditProfileScreen = () => {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useThemeStore().theme;

  const {
    params: { type },
  } = useRoute<RouteProp<RootStackParamList, 'EditProfile'>>();
  const { profileQuery } = useProfile()
  const { refetch, isFetching } = profileQuery()

  const getForm = () => {
    if (type === 'personal_info') return <ProfileEditScreen />;
    if (type === 'avatar') return <AvatarUpdate />;
  };

  return (
    <>
      <MyHeader hasProfileLink={true} withBackButton={true} moduleName={'Profile'} />
      <ScrollView
        keyboardShouldPersistTaps="always"
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        style={{ backgroundColor: colors.background, flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
      >
        <View style={{ marginBottom: bottom + 10, flex: 1 }}>{getForm()}</View>
      </ScrollView>
    </>
  );
};

export default EditProfileScreen;
