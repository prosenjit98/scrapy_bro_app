interface Part {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  images?: string[];
  vendor_full_name: string;
  vendor: {
    id: number;
    fullName: string;
    avatar?: string;
    location?: string;
  };
  condition: 'New' | 'Used' | 'Refurbished';
  images?: InquiryAttachment[];
  stock: number;
  model: { id: number; name: string };
  make: { id: number; name: string };
  isAvailable: boolean;
}