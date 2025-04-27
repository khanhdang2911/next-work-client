const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  verify: '/verify-account/:token/:email',
  workspaces: '/workspaces',
  workspace: '/workspace/:workspaceId',
  channel: '/workspace/:workspaceId/channel/:conversationId',
  directMessage: '/workspace/:workspaceId/dm/:conversationId',
  profile: '/profile',
  viewProfile: '/profile/:userId',
  invite: '/workspace/:workspaceId/invite',
  workspaceInvite: '/workspace/:workspaceId/workspace-invite',
  members: '/workspace/:workspaceId/members',
  notFound: '*'
}

export default routes
