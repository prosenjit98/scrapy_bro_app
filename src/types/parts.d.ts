interface Part {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vendor_full_name: string;
  isNegotiable: boolean;
  city?: string;
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
  category: {
    id: number;
    name: string;
  }
}