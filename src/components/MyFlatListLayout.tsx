import React from 'react';
// import { useThemeStore } from '@/stores/themeStore';
import MyHeader from '@/components/MyHeader';

export default function MyFlatListLayout(props: { children: React.ReactNode, hasProfileLink: boolean, withBackButton?: boolean, moduleName?: string, rendering?: boolean, handleRefetch?: () => void }) {
  const { hasProfileLink } = props;

  return (
    <>
      <MyHeader hasProfileLink={hasProfileLink} withBackButton={props.withBackButton} moduleName={props.moduleName} />
      {props.children}
    </>

  );
}