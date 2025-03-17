import routes from '../config/routes'
import DefaultLayout from '../layouts/DefaultLayout/DefaultLayout'
import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import VerifyPage from '../pages/VerifyPage/VerifyPage'
interface IRoute {
  path: string
  component: any
  layout: any
}
const publicRoutes: IRoute[] = [
  {
    path: routes.login,
    component: Login,
    layout: null
  },
  {
    path: routes.register,
    component: Register,
    layout: null
  },
  {
    path: routes.notFound,
    component: null,
    layout: null
  },
  {
    path: routes.verify,
    component: VerifyPage,
    layout: null
  }
]
const privateRoutes: IRoute[] = []

export { publicRoutes, privateRoutes }
