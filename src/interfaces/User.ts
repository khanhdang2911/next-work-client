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
  avatar: string
  status: 'online' | 'offline' | 'away' | 'busy'
  lastSeen?: string
  accessToken?: string
}
export type { IUserRegister, IUserLogin, IUser }
