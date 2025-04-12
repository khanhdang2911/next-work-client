import axios, { type InternalAxiosRequestConfig } from 'axios'
import { store } from '../redux/store'
import { jwtDecode } from 'jwt-decode'
import { logout, refreshToken } from '../api/auth.api'
import authSlice from '../redux/authSlice'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL + '/api',
  withCredentials: true
})

const refreshInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL + '/api',
  withCredentials: true
})

const normalInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL + '/api',
  withCredentials: true
})

let logoutAuth0: any
export const injectAuth0Functions = (_logout: any) => {
  logoutAuth0 = _logout
}

const handleRefreshToken = async (config: InternalAxiosRequestConfig<any>) => {
  try {
    const auth = store.getState().auth
    config.headers.Authorization = `Bearer ${auth.user?.accessToken}`
    const accessToken = auth.user?.accessToken
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken)
      const currentTime = Date.now() / 1000
      if (decodedToken?.exp && currentTime - decodedToken.exp > 0) {
        const response = await refreshToken()
        if (response.status === 'success') {
          const newAccessToken = response.data.accessToken
          config.headers.Authorization = `Bearer ${newAccessToken}`
          store.dispatch(authSlice.actions.setNewAccessToken(newAccessToken))
        } else {
          store.dispatch(authSlice.actions.logout())
          await logout()
          logoutAuth0({ logoutParams: { returnTo: `${window.location.origin}/login` } })
        }
      }
    }
  } catch (error) {
    store.dispatch(authSlice.actions.logout())
    await logout()
    logoutAuth0({ logoutParams: { returnTo: `${window.location.origin}/login` } })
    return Promise.reject(error)
  }
  return config
}
// Add a request interceptor
instance.interceptors.request.use(
  async (config) => {
    // Do something before request is sent
    return await handleRefreshToken(config)
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

//Refresh token interceptor
refreshInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const auth = store.getState().auth
    config.headers.Authorization = `Bearer ${auth.user?.accessToken}`
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
refreshInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export default instance
export { refreshInstance, normalInstance }
