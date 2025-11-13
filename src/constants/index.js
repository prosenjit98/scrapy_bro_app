import { Dimensions, Platform } from 'react-native';

export const VERSION_NO = '0.0.1';
export const API_URL = 'http://10.0.2.2:3333/api/v1';

// Navigation names
export const home = 'Home';
export const my_profile = 'Profile';
export const my_orders = 'Orders';
export const inquiry = 'Inquiry';
export const profile_edit = 'EditProfile';
export const my_inquiries = 'MyInquiryList';
export const my_inquiry_details = 'MyInquiryDetails';
export const new_inquiry = 'NewInquiry';
export const inquiries = 'Inquires';
export const bargaining = 'Bargains';
export const inquiry_proposal = 'InquiryProposal';
export const proposal_details = 'ProposalDetails';

export const parts = 'Parts';
export const part_details = 'PartDetails';

export const vendor_root = 'VendorRoot';
export const vendor_proposal = 'VendorProposal';
export const vendor_parts = 'VendorParts';
export const part_create = 'PartCreate';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Platform.select({
  android: Dimensions.get('screen').height,
  ios: Dimensions.get('window').height,
});
