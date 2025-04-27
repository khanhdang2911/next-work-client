import { createSlice } from '@reduxjs/toolkit'
import type { IUser } from '../interfaces/User'

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
    },
    // Add a new reducer to update only specific profile fields
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          name: action.payload.name || state.user.name,
          gender: action.payload.gender || state.user.gender,
          status: action.payload.status || state.user.status,
          avatar: action.payload.avatar || state.user.avatar
        }
      }
    }
  }
})

export default authSlice
