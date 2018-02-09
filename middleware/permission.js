export default function ({ route, store, app, redirect }) {
  const shouldBeLoggedIn = [
    'name-edit-id',
    'name-edit-image',
    'name-edit',
    'name-admit',
    'admin-event',
    'me',
    'subscription'
  ]

  const shouldNotBeLoggedIn = [
    'login', 'login-email'
  ]

  const managerOnly = [
    'name-edit-id',
    'name-edit-image',
    'name-edit',
    'name-admit',
    'admin-event'
  ]

  const manager = ['manager', 'admin']

  const from = app.context.from
  if (!store.state.client.id && shouldBeLoggedIn.includes(route.name)) {
    return redirect(from || `/login?status=auth_required&redirect=${route.path}`)
  } else if (store.state.client.id && shouldNotBeLoggedIn.includes(route.name)) {
    return redirect(from || '/?status=logged_in')
  } else if (managerOnly.includes(route.name) && !manager.includes(store.state.client.role)) {
    return redirect(from || '/?status=permission_denied')
  }
}
