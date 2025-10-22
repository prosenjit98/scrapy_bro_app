import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Image, Keyboard, StyleSheet, View } from 'react-native';
import { Image as ImageRes } from 'react-native-image-crop-picker';
import { Button, IconButton } from 'react-native-paper';
import * as strings from '@/constants';
import { AppTheme, useAppTheme } from '../../theme';
import { RootStackParamList } from '../../types/Navigation';
import { useThemeStore } from '@/stores/themeStore';
import { useProfile } from '@/stores/hooks/useProfile';
import ImageUploader from '@/components/ImageUploader';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

const AvatarUpdate: React.FC = () => {
  const { colors } = useThemeStore().theme;
  //@ts-ignore
  const styles = makeStyles(colors);
  const { profileQuery, uploadMutation } = useProfile()
  const { data: profile, refetch, isFetching } = profileQuery()

  const { mutate, isPending } = uploadMutation(() => navigation.navigate(strings.my_profile));
  // const { handleLoader } = updateLoaderState();
  // const navigation = useNavigation<CompositeNavigationProp<NativeStackNavigationProp<RootStackParamList, 'Apply Leave'>, NativeStackNavigationProp<LeaveStackParams>>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Root'>>();

  const [avatar, setAvatar] = React.useState<ImageRes | null>();

  const handleSelectImage = (asset: ImageRes | null) => {
    // Do something with the selected image URI
    if (asset) setAvatar(asset);
  };

  const handleUpdate = async () => {
    Keyboard.dismiss();
    if (!avatar?.path) return Alert.alert('Select an Avatar');
    // handleLoader(true);
    let formData = new FormData()
    formData.append(`avatar`, {
      uri: avatar.path,
      name: avatar.filename || 'avatar',
      type: avatar.mime,
    });
    mutate({ formData: formData, id: profile.id })
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        {avatar?.path ? (
          <ImageUploader handlerOnSelect={handleSelectImage} renderTriggerButton={() => <Image source={{ uri: avatar.path }} style={styles.content} />} />
        ) : (
          <ImageUploader
            handlerOnSelect={handleSelectImage}
            renderTriggerButton={() => (
              <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
                <IconButton icon={props => <MaterialDesignIcons name="camera-plus-outline" {...props} size={24} />} iconColor={'white'} />
              </View>
            )}
          />
        )}
      </View>
      <View>
        <Button mode="contained" loading={isPending} disabled={isPending} style={{ marginVertical: 20, paddingVertical: 5 }} labelStyle={{ fontSize: 16 }} onPress={() => handleUpdate()}>
          Update Profile Picture
        </Button>
        <Button mode="outlined" style={{ paddingVertical: 5 }} labelStyle={{ fontSize: 16 }} onPress={() => navigation.goBack()}>
          Back
        </Button>
      </View>
    </View>
  );
};

export default AvatarUpdate;

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: { flex: 1, justifyContent: 'space-between' },
    top: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { width: 200, height: 200, borderRadius: 100, borderWidth: 1, borderColor: colors.primary, marginBottom: 20, backgroundColor: colors.backdrop },
    header: { fontSize: 24, fontWeight: 'bold', paddingBottom: 20 },
    dateWarper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 35 },
    selectDate: { paddingHorizontal: 15, paddingVertical: 5, backgroundColor: colors.primaryLight, borderWidth: 1, borderColor: colors.primary, borderRadius: 8, marginBottom: 10 },
    selectDateText: { marginVertical: 6, marginHorizontal: 10, fontSize: 13 },
    commentCont: { paddingTop: 10 },
  });
