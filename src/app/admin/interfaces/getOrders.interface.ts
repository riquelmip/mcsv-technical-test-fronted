export interface GetOrdersByCustomerResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: GetOrdersByCustomerResponseDaum[];
}

export interface GetOrdersByCustomerResponseDaum {
  id: number;
  orderDate: string;
  status: string;
  deliveryAddress: GetOrdersByCustomerResponseDeliveryAddress;
  orderDetails: GetOrdersByCustomerResponseOrderDetail[];
}

export interface GetOrdersByCustomerResponseDeliveryAddress {
  id: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  status: boolean;
}

export interface GetOrdersByCustomerResponseOrderDetail {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}
