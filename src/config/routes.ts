const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  workspaces: '/workspaces',
  workspace: '/workspace/:workspaceId',
  channel: '/workspace/:workspaceId/channel/:channelId',
  directMessage: '/workspace/:workspaceId/dm/:directMessageId',
  profile: '/profile',
  viewProfile: '/profile/:userId',
  invite: '/workspace/:workspaceId/invite',
  members: '/workspace/:workspaceId/members',
  notFound: '*'
}

export default routes
