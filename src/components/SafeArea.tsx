import React, { FC, type PropsWithChildren } from 'react';
import { ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SafeArea: FC<PropsWithChildren<{ backgroundColor?: string; style?: ViewProps['style'] }>> = ({ children, backgroundColor, style }) => {
  return <SafeAreaView style={[{ flex: 1, backgroundColor }, style]}>{children}</SafeAreaView>;
};

export default SafeArea;
