export interface AddressPayload {
  customerId: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  status: boolean;
}
export interface CreateAddressResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: any;
}
