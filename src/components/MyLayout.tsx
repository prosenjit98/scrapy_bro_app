import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useThemeStore } from '@/stores/themeStore';
import MyHeader from '@/components/MyHeader';

export default function MyLayout(props: { children: React.ReactNode, hasProfileLink: boolean, withBackButton?: boolean, moduleName?: string, rendering?: boolean, handleRefetch?: () => void }) {
  const { colors } = useThemeStore().theme;
  const { rendering = false, handleRefetch = () => { }, hasProfileLink } = props;

  return (
    <>
      <MyHeader hasProfileLink={hasProfileLink} withBackButton={props.withBackButton} moduleName={props.moduleName} />
      <ScrollView
        refreshControl={<RefreshControl refreshing={rendering} onRefresh={handleRefetch} />}
        style={{ backgroundColor: colors.background, flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 16, paddingTop: 12, justifyContent: 'flex-start' }}>

        {props.children}
      </ScrollView>
    </>

  );
}