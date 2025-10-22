import React, { PropsWithChildren } from 'react';
import { View, ViewProps } from 'react-native';

const Row: React.FC<PropsWithChildren<ViewProps>> = ({ children, style, ...props }) => {
  return (
    <View style={[{ flexDirection: 'row' }, style]} {...props}>
      {children}
    </View>
  );
};
export default Row;
