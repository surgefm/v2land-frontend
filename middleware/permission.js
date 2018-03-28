
/**
 *  doc here
 */
export default function({ route, store, app, redirect, component }) {
  const shouldBeLoggedIn = [
    'name-edit-id',
    'name-edit-image',
    'name-edit',
    'name-admit',
    'admin-event',
    'admin-admit',
    'admin-client',
    'setting',
    'subscription',
  ];

  const shouldNotBeLoggedIn = [
    'login', 'login-email', 'register',
  ];

  const managerOnly = [
    'name-edit-id',
    'name-edit-image',
    'name-edit',
    'name-admit',
    'admin-event',
    'admin-admit',
  ];

  const adminOnly = [
    'admin-client',
  ];

  const manager = ['manager', 'admin'];
  let from;

  if (component) {
    store = component.$store;
    route = component.$route;
    redirect = (path) => {
      return path;
    };
  } else {
    from = app.context.from;
    if (from && from.name.includes('login')) {
      from = '/';
    } else if (from && from.fullPath) {
      from = from.fullPath;
    } else {
      from = null;
    }
  }

  if (!store.state.client.id && shouldBeLoggedIn.includes(route.name)) {
    return redirect(`/login?status=auth_required&redirect=/${route.path}`);
  } else if (store.state.client.id && shouldNotBeLoggedIn.includes(route.name)) {
    return redirect((from || '/') + '?status=logged_in');
  } else if ((managerOnly.includes(route.name) && !manager.includes(store.state.client.role)) ||
    (adminOnly.includes(route.name) && store.state.client.role !== 'admin')) {
    return redirect((from || '/') + '?status=permission_denied');
  }

  return null;
}
