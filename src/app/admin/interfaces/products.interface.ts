export interface GetAllProductsResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: GetAllProductsResponseData[];
}

export interface GetAllProductsResponseData {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export interface Rating {
  rate: number;
  count: number;
}
