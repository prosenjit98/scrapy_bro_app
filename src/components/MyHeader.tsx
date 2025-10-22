import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';
import { Image, StyleSheet, ViewProps } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { AppTheme, useAppTheme } from '../theme';
import ProfileImage from './ProfileImage';
import Row from './Row';
import StatusBar from './StatusBar';
import Icons from '@react-native-vector-icons/material-design-icons';
import { RootStackParamList } from '@/types/navigation';


const MyHeader: React.FC<ViewProps & { hasProfileLink: boolean; withBackButton?: boolean; moduleName?: string }> = props => {
  const { hasProfileLink, withBackButton, moduleName } = props;
  const { dark } = useAppTheme();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Root'>>();

  return (
    <>
      <StatusBar />
      <Row style={styles.container}>
        {withBackButton ? (
          <Row style={styles.backNavigation}>
            <IconButton icon={() => <Icons size={25} name={'keyboard-backspace'} style={styles.navigationIcon} />} onPress={() => navigation.goBack()} />
            <Text style={styles.navigationText}>{moduleName}</Text>
          </Row>
        ) : (<Image source={dark ? require('@/assets/images/splash_logo.png') : require('@/assets/images/splash_logo.png')} style={styles.orgLogo} />
        )}
        {hasProfileLink && <IconButton icon={() => <ProfileImage size={40} />} onPress={() => navigation.navigate('Profile')} />}
      </Row>
    </>
  );
};

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    orgLogo: { height: 40, width: 140, resizeMode: 'contain' },
    newOrgLogo: { height: 40, width: 120, borderRadius: 8, resizeMode: "contain" },
    container: { justifyContent: 'space-between', alignItems: 'center', padding: 12 },
    backNavigation: { alignItems: 'center' },
    navigationText: { fontSize: 24, color: colors.text },
    navigationIcon: { color: colors.text }
  });

export default MyHeader;
