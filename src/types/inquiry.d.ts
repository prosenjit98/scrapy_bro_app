interface Inquiry {
  id?: number;
  userId?: number;
  title: string;
  partDescription: string;
  vehicleMake?: number | null;
  vehicleModel?: number | null;
  attachments?: InquiryAttachment[];
  createdAt?: string;
  updatedAt?: string;
  year?: number | null;
  status: string;
  user?: {
    id: number
    fullName: string
    email: string
  };
  make: Make;
  model: Model;
  proposals: Proposal[]
  proposalsCount: number
}

interface Make {
  id: number;
  name: string;
}

interface Model {
  id: number;
  name: string;
}

interface InquiryAttachment {
  file: {
    url: string;
    name: string;
  }
  createdAt?: string;
  updatedAt?: string;
}