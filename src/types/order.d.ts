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
  status: 'pending' | 'completed' | 'canceled' | 'shipped' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
  parts?: Part;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
}

interface CreateOrderPayload extends Order { }

interface OrderConfirmation {
  orderId: string;
  message: string;
}