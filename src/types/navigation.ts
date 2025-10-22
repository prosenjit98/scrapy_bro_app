import * as strings from '@/constants';
import { NavigatorScreenParams } from '@react-navigation/native';


export type RootStackParamList = {
  Root: NavigatorScreenParams<TabParamList>;
  [strings.my_profile]: undefined;
}

export type TabParamList = {
  [strings.home]: undefined;
  [strings.my_orders]: undefined;
  [strings.inquiry]: undefined;
}