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
