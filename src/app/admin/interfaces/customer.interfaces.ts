export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface GetAllCustomersResponse {
  success: boolean;
  status: number;
  message: string;
  data: Customer[];
}

export interface GetCustomerByIdResponse {
  success: boolean;
  status: number;
  message: string;
  data: Customer;
}

export interface CreateCustomerResponse {
  success: boolean;
  status: number;
  message: string;
  data: Customer;
}

export interface GetCustomerByUserIdResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: GetCustomerByUserIdResponseData;
}

export interface GetCustomerByUserIdResponseData {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  userId: number;
  addresses: Address[];
  orders: any[];
}
export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  status: boolean;
}
