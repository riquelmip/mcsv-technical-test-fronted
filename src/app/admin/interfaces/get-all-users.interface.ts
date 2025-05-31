export interface GetAllUsersGeneralResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: GetAllUsersResponse[];
}

export interface GetAllUsersResponse {
  userId: number;
  username: string;
  password: null;
  provider: string;
  name: null | string;
  email: null | string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  roles: GetAllUsersResponse[];
  enable: boolean;
  oauth2: boolean;
}

export interface RoleGetAllUsersResponse {
  roleId: number;
  roleName: string;
  rolePermissions: any[];
}
