import { normalInstance } from '../config/httpRequest'
const verifyAccount = async (token: string, email: string) => {
  const response = await normalInstance.post('/mail/verify-account', { token, email })
  return response.data
}

export { verifyAccount }
