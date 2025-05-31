export interface CreateUserGeneralResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: CreateUserResponse;
}

export interface CreateUserResponse {
  userId: number;
  username: string;
  password: string;
  provider: string;
  name: null;
  email: null;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  roles: CreateUserResponse[];
  enable: boolean;
  oauth2: boolean;
}

export interface RoleCreateUserResponse {
  roleId: number;
  roleName: string;
  rolePermissions: any[];
}
