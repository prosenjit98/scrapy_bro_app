interface Order {
  id: string;
  userId: number;
  user: string
  vendorId: number;
  vendor: string;
  proposalId: string;
  price: number;
  totalPrice: number;
  quantity: number;
  unitPrice: number;
  status: 'pending' | 'completed' | 'canceled';
  createdAt: Date;
  updatedAt: Date;
  parts?: Part;
}

interface CreateOrderPayload extends Order { }

interface OrderConfirmation {
  orderId: string;
  message: string;
}