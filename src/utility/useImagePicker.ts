import { useState } from 'react';
import ImageCropPicker, { Image, Options } from 'react-native-image-crop-picker';

export interface ImagePickerProps {
  onSelectImage: (uri: string) => void;
}


export const useImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const handleImagePicker = async (callback: (uri: Image | null) => void, source: 'camera' | 'gallery', options?: any) => {
    const mergedOptions: Options = {
      compressImageQuality: 0.4,
      height: 400,
      width: 300,
      cropping: true,
      forceJpg: true,
      mediaType: 'photo',
      freeStyleCropEnabled: true
    };


    // const launchFunction = source === 'camera' ? launchCamera : launchImageLibrary;
    // launchFunction(mergedOptions, (response: ImagePickerResponse) => {
    //   if (response.didCancel) {
    //     console.log('User cancelled image picker');
    //   } else if (response.errorCode) {
    //     console.log('ImagePicker Error: ', response);
    //   }else {
    //     // Update state with the selected image URI
    //     const asset = response?.assets ? response?.assets[0] : null
    //     setSelectedImage(asset);
    //     callback(asset);
    //   }
    // });
    try {
      const result = source === 'camera' ? await ImageCropPicker.openCamera(mergedOptions) : await ImageCropPicker.openPicker(mergedOptions);

      setSelectedImage(result);
      callback(result);
    } catch (err) {
      setSelectedImage(null);
    }
  };

  return { selectedImage, handleImagePicker };
};
