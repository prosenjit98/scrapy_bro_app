import React, { useEffect, useState } from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Button, Text } from 'react-native-paper'
// import * as ImagePicker from 'react-native-image-picker'
import { useInquiries } from '@/stores/hooks/useInquiries'
import ImageUploader from '@/components/ImageUploader'
import { Image as ImageRes } from 'react-native-image-crop-picker';
// import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons'
import { AppTheme } from '@/theme'
// import { useThemeStore } from '@/stores/themeStore'
import MyLayout from '@/components/MyLayout'
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
  // const { colors } = useThemeStore().theme;

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

  const { control, handleSubmit, reset } = useForm<InquiryFormValues>({
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
    <MyLayout withBackButton={true} moduleName={'Inquiry'} hasProfileLink={true}>
      <Text variant="headlineSmall" style={{ marginBottom: 12 }}>
        {inquiry ? 'Edit Inquiry' : 'New Inquiry'}
      </Text>

      <TextField
        control={control}
        name="title"
        label="Part Title"
        placeholder="e.g., Front Bumper"
      />
      <TextField
        control={control}
        name="description"
        label="Description"
        multiline
        numberOfLines={4}
        placeholder="Describe what you’re looking for..."
      />

      <SelectField
        control={control}
        name="vehicleMake"
        label="Select Company"
        options={vMakes ?? []}
        searchable
      />

      <SelectField
        control={control}
        name="vehicleModel"
        label="Select Model"
        options={vModels ?? []}
        searchable
      />

      <View style={{ marginVertical: 10 }}>
        <ImageUploader
          handlerOnSelect={handleSelectImage}
        />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
        {images.map((uri, i) => (
          <TouchableOpacity key={i}>
            <Image
              source={{ uri }}
              style={{ width: 90, height: 90, margin: 5, borderRadius: 8 }}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        // disabled={!title || !(images.length > 0)}
        loading={createPending || updatePending}
      >
        {inquiry ? 'Update Inquiry' : 'Create Inquiry'}
      </Button>
    </MyLayout>
  )
}

export default InquiryFormScreen;

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: { flex: 1, justifyContent: 'space-between' },
    top: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { width: 200, height: 200, borderRadius: 100, borderWidth: 1, borderColor: colors.primary, marginBottom: 20, backgroundColor: colors.backdrop },
    header: { fontSize: 24, fontWeight: 'bold', paddingBottom: 20 },
    dateWarper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 35 },
    selectDate: { paddingHorizontal: 15, paddingVertical: 5, backgroundColor: colors.primaryLight, borderWidth: 1, borderColor: colors.primary, borderRadius: 8, marginBottom: 10 },
    selectDateText: { marginVertical: 6, marginHorizontal: 10, fontSize: 13 },
    commentCont: { paddingTop: 10 },
  });

