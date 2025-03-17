import { createSlice } from '@reduxjs/toolkit'
import { IUser } from '../interfaces/User'

interface AuthState {
  user: IUser | null
  isAuthenticated: boolean
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false
  } as AuthState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    setNewAccessToken: (state, action) => {
      state.user = {
        ...state.user,
        accessToken: action.payload
      } as IUser
    }
  }
})

export default authSlice
