interface Proposal {
  id: number,
  description: string,
  vendorId?: number,
  partId?: number,
  proposerId: number,
  price: number,
  quantity: number,
  isSelfAccepted: boolean,
  isOtherAccepted: boolean,
  createdAt: string,
  updatedAt: string,
  inquiryId?: number,
  proposer: { id: number, fullName: string },
  vendor?: { id: number, fullName: string },
  part?: {
    name: string,
    id: number,
    model: { id: number; name: string };
    make: { id: number; name: string };
  },
  comments?: Comment[]
}
interface OptionsStr {
  key: string;
  value: string | number
}

interface Comment {
  id: number;
  content: string;
  userId: number;
  createdAt: string;
  commenter: { id: number, fullName: string }
}