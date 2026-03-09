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
  inquiryUserId?: number,
  orderCreated?: boolean,
  proposer: { id: number, fullName: string },
  vendor?: { id: number, fullName: string },
  inquiry?: { id: number, userId: number },
  part?: Part,
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