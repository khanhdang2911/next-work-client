import { RootState } from '@reduxjs/toolkit/query'

const getAuthSelector = (state: RootState<any, any, any>) => {
  return state.auth
}

export { getAuthSelector }
