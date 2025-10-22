import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Image } from 'react-native-image-crop-picker';
import { Button, Text, TouchableRipple } from 'react-native-paper';
import { AppTheme } from '@/theme';
import { useImagePicker } from '@/utility/useImagePicker';
import { useThemeStore } from '@/stores/themeStore';


interface ImageUploaderProps {
  handlerOnSelect: (asset: Image | null) => void;
  renderTriggerButton?: any;
}

const ImageUploader: React.FC<ImageUploaderProps> = props => {
  const { handlerOnSelect, renderTriggerButton } = props;
  const { colors } = useThemeStore().theme;
  // @ts-ignore
  const styles = makeStyles(colors)
  const [isModalVisible, setModalVisible] = useState(false);
  const { handleImagePicker } = useImagePicker();
  const localHandler = (asset: Image | null) => {
    setModalVisible(false);
    handlerOnSelect(asset)
  }
  const handleModelButtonPress = (item: 'camera' | 'gallery') => {
    handleImagePicker(localHandler, item);
  };

  return (
    <View>
      {renderTriggerButton ? <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>{renderTriggerButton()}</TouchableWithoutFeedback> :
        <Button mode="contained" onPress={() => setModalVisible(true)}>
          Choose Image
        </Button>
      }
      <Modal visible={isModalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)} style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.mainView}>
              <TouchableRipple onPress={() => handleModelButtonPress('gallery')}>
                <View style={styles.textContainer}>
                  <Text style={styles.textStyle}>From Gallery</Text>
                </View>
              </TouchableRipple>

              <TouchableRipple onPress={() => handleModelButtonPress('camera')}>
                <View style={styles.textContainer}>
                  <Text style={styles.textStyle}>Open Camera</Text>
                </View>
              </TouchableRipple>
              <TouchableRipple onPress={() => setModalVisible(false)}>
                <View style={styles.textContainer}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </View>
              </TouchableRipple>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ImageUploader;

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    modalContainer: { width: '100%', height: '100%' },
    modalContent: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', width: '100%' },
    mainView: { height: '20%', width: '100%', paddingHorizontal: 10, backgroundColor: colors.background, borderTopColor: colors.mutedText, borderTopWidth: 1 },
    icon: { backgroundColor: colors.primary, borderRadius: 8 },
    textStyle: { fontSize: 16 },
    textContainer: { alignItems: 'center', borderBottomColor: colors.mutedText, borderBottomWidth: 1, paddingVertical: 15 }
  })
