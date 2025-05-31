export interface LoginResponse {
  isSuccess: boolean;
  status:    string;
  message:   string;
  data:      LoginResponseData;
}

export interface LoginResponseData {
  username: string;
  message:  string;
  status:   boolean;
  jwt:      string;
}
