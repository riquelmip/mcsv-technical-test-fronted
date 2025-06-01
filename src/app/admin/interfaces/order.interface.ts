export interface OrderPayload {
  customerId: number;
  deliveryAddressId: number;
  orderDetails: OrderDetailsPayload[];
}

export interface OrderDetailsPayload {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CreateOrderResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: CreateOrderResponseData;
}

export interface CreateOrderResponseData {
  id: number;
  orderDate: string;
  status: string;
  deliveryAddress: CreateOrderResponseDeliveryAddress;
  orderDetails: CreateOrderResponseOrderDetail[];
}

export interface CreateOrderResponseDeliveryAddress {
  id: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  status: boolean;
}

export interface CreateOrderResponseOrderDetail {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}
