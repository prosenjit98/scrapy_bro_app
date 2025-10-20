import { Dimensions, Platform } from "react-native";

export const VERSION_NO = '0.0.1';


export const SCREEN_WIDTH = Dimensions.get('window').width
export const SCREEN_HEIGHT = Platform.select({
  android: Dimensions.get('screen').height,
  ios: Dimensions.get('window').height,
})