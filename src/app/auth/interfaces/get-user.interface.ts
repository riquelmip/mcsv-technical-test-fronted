export interface GetUserResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: GetUserResponseData;
}

export interface GetUserResponseData {
  userId: number;
  username: string;
  password: null;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  roles: Role[];
  enable: boolean;
}

export interface Role {
  roleId: number;
  roleName: string;
  rolePermissions: any[];
}
