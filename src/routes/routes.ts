import routes from '../config/routes'
import WorkspacesPage from '../pages/WorkspacesPage/WorkspacesPage'
import WorkspacePage from '../pages/WorkspacePage/WorkspacePage'
import ProfilePage from '../pages/ProfilePage/ProfilePage'
import ViewProfilePage from '../pages/ProfilePage/ViewProfilePage'
import MembersPage from '../pages/MembersPage/MembersPage'
import Register from '../pages/Register/Register'
import Login from '../pages/Login/Login'
import VerifyPage from '../pages/VerifyPage/VerifyPage'
import WorkspaceInvitePage from '../pages/InvitePage/WorkspaceInvitePage'
import AcceptInvitationPage from '../pages/InvitePage/AcceptInvitationPage'

interface IRoute {
  path: string
  component: any
  layout: any
}

const publicRoutes: IRoute[] = [
  {
    path: routes.notFound,
    component: WorkspacesPage,
    layout: null
  },
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
    path: routes.verify,
    component: VerifyPage,
    layout: null
  },
  {
    path: routes.acceptInvitation,
    component: AcceptInvitationPage,
    layout: null
  }
]

const privateRoutes: IRoute[] = [
  {
    path: routes.home,
    component: WorkspacesPage,
    layout: null
  },
  {
    path: routes.workspaces,
    component: WorkspacesPage,
    layout: null
  },
  {
    path: routes.workspace,
    component: WorkspacePage,
    layout: null
  },
  {
    path: routes.channel,
    component: WorkspacePage,
    layout: null
  },
  {
    path: routes.directMessage,
    component: WorkspacePage,
    layout: null
  },
  {
    path: routes.profile,
    component: ProfilePage,
    layout: null
  },
  {
    path: routes.viewProfile,
    component: ViewProfilePage,
    layout: null
  },
  {
    path: routes.workspaceInvite,
    component: WorkspaceInvitePage,
    layout: null
  },
  {
    path: routes.members,
    component: MembersPage,
    layout: null
  }
]

export { publicRoutes, privateRoutes }
