interface Proposal {
  id: number,
  description: string,
  vendorId?: number,
  partId?: number,
  proposerId: number,
  price: number,
  quantity: number,
  isAccepted: boolean,
  createdAt: string,
  updatedAt: string,
  inquiryId?: number,
  proposer: { id: number, fullName: string },
  vendor?: { id: number, fullName: string },
  part?: null,
  comments?: Comment[]
}
interface OptionsStr {
  key: string;
  value: string | number
}

interface Comment {
  id: number;
  message: string;
  commenter: { id: number, fullName: string }
}