interface IUserRegister {
  name: string
  email: string
  password: string
  gender: string
}
interface IUserLogin {
  email: string
  password: string
}

interface IUser {
  _id: string
  name: string
  email: string
  avatar?: string
  status: 'online' | 'away'
  gender: string
  lastSeen?: string
  accessToken?: string
}

export interface IUsersAdmin {
  _id: string;
  email: string;
  gender: 'Male' | 'Female' | string;
  isActivated: boolean;
  createdAt: string;
  updatedAt: string; 
  name: string
  avatar: string;
  status: 'Active' | 'Away' | 'Offline' | string;
  role: string;
  roles: string[];
  isLocked: boolean;
  numberOfWorkspaces: number | 0;
}

interface UserAdminApiResponse {
  status: string
  data: {
    users: IUsersAdmin[]
    currentPage: number
    totalPages: number
  }
}


interface IChannelMember extends IUser {
  joinedAt: string
  admin: boolean
}

export type { 
  IUserRegister, 
  IUserLogin, 
  IUser, 
  IChannelMember,
  UserAdminApiResponse
}
