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

interface IChannelMember extends IUser {
  joinedAt: string
  admin: boolean
}

export type { IUserRegister, IUserLogin, IUser, IChannelMember }
