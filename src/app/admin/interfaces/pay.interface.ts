export interface PayOrderResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: PayOrderResponseData;
}

export interface PayOrderResponseData {
  id: number;
  order: OrderPayOrderResponse;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
}

export interface OrderPayOrderResponse {
  id: number;
  orderDate: string;
  status: string;
  deliveryAddress: DeliveryAddressPayOrderResponse;
  orderDetails: OrderDetailPayOrderResponse[];
}

export interface DeliveryAddressPayOrderResponse {
  id: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  status: boolean;
}

export interface OrderDetailPayOrderResponse {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}
