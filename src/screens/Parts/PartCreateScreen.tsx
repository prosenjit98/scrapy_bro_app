// src/screens/parts/PartCreateScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partSchema, PartSchemaType } from '@/validation/partSchemas';
import { CheckboxField, SelectField, TextField } from '@/components/form';
import { useCreatePart, useGetPartDetails, useUpdatePart } from '@/stores/hooks/useParts';
import { Image as ImageRes } from 'react-native-image-crop-picker';
import ImageUploader from '@/components/ImageUploader';
import MyLayout from '@/components/MyLayout';
import { vendor_parts } from '@/constants';
import apiClientAxios from '@/api/client';
import { useQuery } from '@tanstack/react-query';

// export type partFormValues = z.infer<typeof partSchema>

export default function PartCreateScreen({ navigation, route }: any) {
  const partId = route.params?.partId;
  const { data: parts } = useGetPartDetails(partId);
  const [images, setImages] = useState<string[]>([])
  const [avatars, setAvatars] = useState<ImageRes[] | []>([])
  const { mutate: createPart, isPending: isCreating } = useCreatePart(() => navigation.navigate(vendor_parts as never));
  const { mutate: updatePart, isPending: isUpdating } = useUpdatePart(() => navigation.navigate(vendor_parts as never));

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClientAxios.get('/categories');
      return (res.data.data ?? []).map((c: { name: string; id: number }) => ({
        label: c.name,
        value: c.id,
      }));
    },
  });

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
      category_id: parts?.make?.category?.id ?? undefined,
    },
  });

  const selectedCategoryId = form.watch('category_id');
  const selectedMakeId = form.watch('vehicle_make_id');

  // Fetch makes filtered by selected category
  const { data: vMakes } = useQuery({
    queryKey: ['vehicle-makes-by-category', selectedCategoryId],
    queryFn: async () => {
      const res = await apiClientAxios.get(`/makes?categoryId=${selectedCategoryId}`);
      return (res.data.data ?? []).map((m: { name: string; id: number }) => ({
        label: m.name,
        value: m.id,
      }));
    },
    enabled: !!selectedCategoryId,
  });

  const { data: vModels } = useQuery({
    queryKey: ['vehicle-models-by-make', selectedMakeId],
    queryFn: async () => {
      const res = await apiClientAxios.get(`/models?makeId=${selectedMakeId}`)
      return (res.data.data ?? []).map((m: { name: string; id: number }) => ({
        label: m.name,
        value: m.id,
      }))
    },
    enabled: !!selectedMakeId,
  });

  // Reset make & model when category changes
  const prevCategoryRef = React.useRef(selectedCategoryId);
  useEffect(() => {
    if (prevCategoryRef.current !== undefined && prevCategoryRef.current !== selectedCategoryId) {
      form.setValue('vehicle_make_id', undefined as any);
      form.setValue('vehicle_model_id', undefined as any);
    }
    prevCategoryRef.current = selectedCategoryId;
  }, [selectedCategoryId]);

  // Reset model when make changes
  const prevMakeRef = React.useRef(selectedMakeId);
  useEffect(() => {
    if (prevMakeRef.current !== undefined && prevMakeRef.current !== selectedMakeId) {
      form.setValue('vehicle_model_id', undefined as any);
    }
    prevMakeRef.current = selectedMakeId;
  }, [selectedMakeId]);

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
        category_id: parts?.make?.category?.id ?? undefined,
      });
    }
  }, [partId, parts]);


  useEffect(() => {
    if (parts?.images && parts?.images?.length > 0) {
      let urls = parts.images.map((attach: any) => attach.file.url)
      setImages(images => [...images, ...urls])
      // setAvatars(parts.images as any[] || []);
    }
  }, [parts?.images])


  const onSubmit = async (data: any) => {
    const { category_id, ...submitData } = data;
    const formData = new FormData();
    Object.entries(submitData).forEach(([k, v]) => formData.append(k, v as string));
    avatars.forEach((avatar) => {
      formData.append('images[]', {
        uri: avatar.path,
        name: avatar.filename || 'avatar',
        type: avatar.mime,
      } as any)
    });
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
        name="category_id"
        label="Select Category"
        options={categories ?? []}
        searchable
      />
      <SelectField
        control={form.control}
        name="vehicle_make_id"
        label="Select Company"
        options={vMakes ?? []}
        searchable
      />
      <SelectField
        control={form.control}
        name="vehicle_model_id"
        label="Select Model"
        options={vModels ?? []}
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
        loading={isCreating || isUpdating}
        onPress={form.handleSubmit(onSubmit)}
        style={{ marginTop: 20 }}
      >
        Save
      </Button>
    </MyLayout>
  );
}