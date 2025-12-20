import * as strings from '@/constants';
import { NavigatorScreenParams } from '@react-navigation/native';


export type RootStackParamList = {
  Root: NavigatorScreenParams<TabParamList>;
  [strings.my_profile]: undefined;
  [strings.profile_edit]: { type: string; id?: number | string | undefined };
  [strings.vendor_root]: VendorTabParam;
  [strings.inquiry_proposal]: undefined;
  [strings.proposal_details]: { proposalId: number | string };
  [strings.manage_bargaining]: { partId: number };
  [strings.parts]: undefined;
  [strings.part_details]: { partId: number };
  [strings.part_create]: undefined | { partId: number }
}

export type TabParamList = {
  [strings.home]: undefined;
  [strings.my_orders]: undefined;
  [strings.inquiry]: undefined;
  [strings.bargaining]: undefined;
}

export type InquiryStackParamList = {
  [strings.my_inquiries]: undefined;
  [strings.my_inquiry_details]: { inquiryId: number | string };
  [strings.new_inquiry]: { inquiryId: number | string | null }
}

export type VendorTabParam = {
  [strings.vendor_proposal]: undefined
  [strings.vendor_parts]: undefined
}