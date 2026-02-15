import React, { useEffect, useState } from 'react'
import { View, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { Button, Text } from 'react-native-paper'
// import * as ImagePicker from 'react-native-image-picker'
import { useInquiries } from '@/stores/hooks/useInquiries'
import ImageUploader from '@/components/ImageUploader'
import { Image as ImageRes } from 'react-native-image-crop-picker';
// import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons'
import { AppTheme } from '@/theme'
import { useThemeStore } from '@/stores/themeStore'
import MyNewHeader from '@/components/MyNewHeader'
import { useVehicles } from '@/stores/hooks/useVehicles'
import useLoaderState from '@/stores/loaderState'
import { SelectField, TextField } from '@/components/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { inquirySchema } from '@/validation/inquirySchemas'
import { useAuthStore } from '@/stores/authStore'
import { my_inquiries } from '@/constants'

export type InquiryFormValues = z.infer<typeof inquirySchema>

const InquiryFormScreen = ({ navigation, route }: any) => {
  const inquiry = route.params?.inquiry
  const { createMutation, updateMutation } = useInquiries();
  const { mutate: createInquiry, isPending: createPending } = createMutation(() => navigation.navigate(my_inquiries))
  const { mutate: updateInquiry, isPending: updatePending } = updateMutation(() => navigation.navigate(my_inquiries))
  const { modifiedFetchModels, modifiedFetchMakes } = useVehicles();
  const { isPending: makeFetching, data: vMakes } = modifiedFetchMakes();
  const { isPending: modelFetching, data: vModels } = modifiedFetchModels();
  const { user } = useAuthStore();
  const vehicleFetching = modelFetching || makeFetching;
  const [images, setImages] = useState<string[]>(inquiry?.images || [])
  const [avatars, setAvatars] = useState<ImageRes[] | []>(inquiry?.images || [])
  const { colors } = useThemeStore().theme;
  //@ts-ignore
  const styles = makeStyles(colors)

  const showLoader = React.useCallback(() => {
    useLoaderState.getState().show();
  }, []);

  useEffect(() => {
    if (inquiry?.attachments.length > 0) {
      let urls = inquiry.attachments.map((attach: InquiryAttachment) => attach.file.url)
      setImages(images => [...images, ...urls])
    }
  }, [inquiry?.attachments])

  useEffect(() => {
    if (vehicleFetching) {
      showLoader();
    }
  }, [vehicleFetching, showLoader]);

  const { control, handleSubmit } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      title: inquiry?.title || '',
      description: inquiry?.partDescription || '',
      vehicleMake: inquiry?.vehicleMake || null,
      vehicleModel: inquiry?.vehicleModel || null,
    },
  })

  const handleSelectImage = (asset: ImageRes | null) => {
    // Do something with the selected image URI
    if (asset) {
      setAvatars([...avatars, asset]);
      setImages([...images, asset.path])
    }

  };

  const onSubmit = async (values: InquiryFormValues) => {
    const formData = new FormData()
    formData.append('title', values['title'])
    formData.append('partDescription', values['description'])
    formData.append('vehicleMake', values['vehicleMake'])
    formData.append('vehicleModel', values['vehicleModel'])
    formData.append('user_id', user?.id!)

    avatars.forEach((avatar) => {
      formData.append('images[]', {
        uri: avatar.path,
        name: avatar.filename || 'avatar',
        type: avatar.mime,
      } as any)
    })

    if (inquiry) updateInquiry({ id: inquiry.id, formData })
    else createInquiry(formData)
  }

  return (
    <View style={styles.container}>
      <MyNewHeader
        withBackButton={true}
        title={inquiry ? 'Edit Inquiry' : 'New Inquiry'}
        subtitle="Provide details to get better proposals"
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Inquiry Details</Text>

        <TextField
          control={control}
          name="title"
          label="Part Name"
          placeholder="Enter part name"
          fontIconName="wrench"
        />
        <TextField
          control={control}
          name="description"
          label="Description"
          multiline
          numberOfLines={4}
          placeholder="Describe what you're looking for..."
          fontIconName="file-document-outline"
        />

        <SelectField
          control={control}
          name="vehicleModel"
          label="Select Model"
          options={vModels ?? []}
          searchable
        />

        <SelectField
          control={control}
          name="vehicleMake"
          label="Select Company"
          options={vMakes ?? []}
          searchable
        />

        <View style={styles.uploaderWrapper}>
          <ImageUploader
            handlerOnSelect={handleSelectImage}
          />
        </View>

        <View style={styles.imageGrid}>
          {images.map((uri, i) => (
            <TouchableOpacity key={i}>
              <Image
                source={{ uri }}
                style={styles.imageThumb}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={createPending || updatePending}
          style={styles.submitButton}
        >
          {inquiry ? 'Update Inquiry' : 'Create Inquiry'}
        </Button>
      </ScrollView>
    </View>
  )
}

export default InquiryFormScreen;

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 24,
    },
    sectionTitle: {
      marginBottom: 12,
      fontWeight: '600',
      color: colors.text,
    },
    uploaderWrapper: {
      marginVertical: 10,
    },
    imageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 10,
      gap: 8,
    },
    imageThumb: {
      width: 84,
      height: 84,
      borderRadius: 8,
    },
    submitButton: {
      marginTop: 8,
      borderRadius: 8,
    },
  });

