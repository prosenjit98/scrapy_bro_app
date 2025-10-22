import React from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ActivityIndicator } from 'react-native-paper';
import { useProfile } from '@/stores/hooks/useProfile';

const DefaultImage: React.FC<{ size: number }> = ({ size }) => (
  <FastImage
    style={{ width: size, height: size }}
    source={require('@/assets/images/avatar.png')}
    resizeMode={FastImage.resizeMode.cover}
  />
);

const ProfileImage = React.memo((props: { size: number }) => {
  const { size } = props;
  const { profileQuery } = useProfile();
  const { data: profile, isLoading } = profileQuery()
  const [imageError, setImageError] = React.useState(false);
  const [isFetching, setLoading] = React.useState(false);
  // const { data: profile } = useGetProfileQuery({ id: user?.code, email: user?.email } || skipToken);

  return (
    <>
      {profile?.profilePicture?.file?.url && !imageError ? (
        <View>
          <ActivityIndicator
            style={{ position: 'absolute', top: size / 2 - 12, left: size / 2 - 12, zIndex: 10 }}
            size="small"
            animating={isLoading || isFetching}
            color="red"
          />
          <FastImage
            style={{ width: size, height: size, borderRadius: size / 2 }}
            source={{
              uri: profile?.profilePicture?.file?.url,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setImageError(true);
              setLoading(false);
            }}
          />
        </View>
      ) : (
        <DefaultImage size={size} />
      )}
    </>
  );
});

export default ProfileImage;

const styles = StyleSheet.create({});
