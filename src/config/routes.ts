const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  workspaces: '/workspaces',
  workspace: '/workspace/:workspaceId',
  channel: '/workspace/:workspaceId/channel/:conversationId',
  directMessage: '/workspace/:workspaceId/dm/:conversationId',
  profile: '/profile',
  viewProfile: '/profile/:userId',
  invite: '/workspace/:workspaceId/invite',
  members: '/workspace/:workspaceId/members',
  notFound: '*'
}

export default routes
