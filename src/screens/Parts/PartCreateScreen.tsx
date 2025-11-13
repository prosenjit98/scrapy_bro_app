// src/screens/parts/PartCreateScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Button, Checkbox } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partSchema, PartSchemaType } from '@/validation/partSchemas';
import { CheckboxField, SelectField, TextField } from '@/components/form';
import { useCreatePart, useGetPartDetails, useUpdatePart } from '@/stores/hooks/useParts';
import { Image as ImageRes } from 'react-native-image-crop-picker';
import ImageUploader from '@/components/ImageUploader';
import MyLayout from '@/components/MyLayout';
import { vendor_parts, vendor_root } from '@/constants';
import { useAuthStore } from '@/stores/authStore';
import { useVehicles } from '@/stores/hooks/useVehicles';
import { z } from 'zod'

// export type partFormValues = z.infer<typeof partSchema>

export default function PartCreateScreen({ navigation, route }: any) {
  const partId = route.params?.partId;
  const { data: parts } = useGetPartDetails(partId);
  const [images, setImages] = useState<string[]>([])
  const [avatars, setAvatars] = useState<ImageRes[] | []>([])
  const { mutate: createPart, isPending: isCreating } = useCreatePart(() => navigation.navigate(vendor_root, { screen: vendor_parts }));
  const { mutate: updatePart, isPending: isUpdating } = useUpdatePart(() => navigation.navigate(vendor_root, { screen: vendor_parts }));
  const { user } = useAuthStore();
  const { modifiedFetchModels, modifiedFetchMakes } = useVehicles();
  const { isPending: makeFetching, data: vMakes } = modifiedFetchMakes();
  const { isPending: modelFetching, data: vModels } = modifiedFetchModels();

  const form = useForm<PartSchemaType>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      name: parts?.name || '',
      description: parts?.description || '',
      price: parts?.price?.toString() || '0',
      condition: parts?.condition || '',
      stock: parts?.stock?.toString() || '0',
      vehicle_model_id: parts?.model?.id ?? undefined,
      is_available: parts?.isAvailable || false,
      vehicle_make_id: parts?.make?.id ?? undefined,
    },
  });

  useEffect(() => {
    if (partId && parts) {
      form.reset({
        name: parts?.name || '',
        description: parts?.description || '',
        price: parts?.price?.toString() || '0',
        condition: parts?.condition || '',
        stock: parts?.stock?.toString() || '0',
        vehicle_model_id: parts?.model?.id ?? undefined,
        is_available: parts?.isAvailable || false,
        vehicle_make_id: parts?.make?.id ?? undefined,
      });
    }
  }, [partId, parts]);


  useEffect(() => {
    if (parts?.images && parts?.images?.length > 0) {
      let urls = parts.images.map((attach: any) => attach.file.url)
      setImages(images => [...images, ...urls])
      setAvatars(parts.images as any[] || []);
    }
  }, [parts?.images])


  const onSubmit = async (data: any) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v as string));
    avatars.forEach((avatar) => {
      formData.append('images[]', {
        uri: avatar.path,
        name: avatar.filename || 'avatar',
        type: avatar.mime,
      } as any)
    });
    formData.append('vendorId', user?.id)
    if (partId) {
      updatePart({ id: partId, formData });
    } else {
      createPart({ payload: formData });
    }
  };

  const handleSelectImage = (asset: ImageRes | null) => {
    // Do something with the selected image URI
    if (asset) {
      setAvatars([...avatars, asset]);
      setImages([...images, asset.path])
    }

  };

  return (
    <MyLayout withBackButton={true} hasProfileLink={false} moduleName={partId ? 'Edit Parts' : 'Create New Parts'}>
      <TextField control={form.control} name="name" label="Part Name" />
      <TextField control={form.control} name="description" label="Description" multiline />
      <TextField control={form.control} name="price" label="Price" keyboardType="numeric" />
      <SelectField
        control={form.control}
        name="condition"
        label="Condition"
        options={[
          { label: 'New', value: 'new' },
          { label: 'Used', value: 'used' },
          { label: 'Refurbished', value: 'refurbished' },
        ]}
      />
      <TextField control={form.control} name="stock" label="Stock Count" keyboardType="numeric" />

      <SelectField
        control={form.control}
        name="vehicle_model_id"
        label="Select Model"
        options={vModels ?? []}
        searchable
      />
      <SelectField
        control={form.control}
        name="vehicle_make_id"
        label="Select Company"
        options={vMakes ?? []}
        searchable
      />

      <CheckboxField
        control={form.control}
        name="is_available"
        label="Available?"
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
        loading={isCreating || isUpdating || makeFetching || modelFetching}
        onPress={form.handleSubmit(onSubmit)}
        style={{ marginTop: 20 }}
      >
        Save
      </Button>
    </MyLayout>
  );
}