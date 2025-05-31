export interface ValidateTokenResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: ValidateTokenResponseData;
}

export interface ValidateTokenResponseData {
  username: string;
  token: string;
}
