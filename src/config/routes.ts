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
  acceptInvitation: '/workspace/:workspaceId/accept-invitation/:token',
  members: '/workspace/:workspaceId/members',
  admin: '/admin',
  adminWorkspaces: '/admin/workspaces',
  adminUsers: '/admin/users',
  adminWorkspaceChannels: '/admin/workspace/:workspaceId/channels',
  adminWorkspaceUsers: '/admin/workspace/:workspaceId/users',
  forbidden: '/forbidden',
  notFound: '*'
}

export default routes
