export interface GetUserResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: GetUserResponseData;
}

export interface GetUserResponseData {
  userId: number;
  username: string;
  password: string;
  provider: string;
  name: any;
  email: any;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  roles: Role[];
  oauth2: boolean;
  enable: boolean;
}

export interface Role {
  roleId: number;
  roleName: string;
  rolePermissions: RolePermission[];
}

export interface RolePermission {
  permissionId: number;
  permissionName: string;
}
