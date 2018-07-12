import Vue from 'vue';
import Router from 'vue-router';

const Homepage = () => import(/* webpackChunkName: "basic" */ '~/pages/index.vue').then((m) => m.default || m);

const Event = () => import(/* webpackChunkName: "basic" */ '~/pages/event/index.vue').then((m) => m.default || m);
const EventPlaceholder = () => import(/* webpackChunkName: "basic" */ '~/pages/event/placeholder.vue').then((m) => m.default || m);
const EventPost = () => import(/* webpackChunkName: "basic" */ '~/pages/event/post.vue').then((m) => m.default || m);
const EventAdmit = () => import(/* webpackChunkName: "basic-manage" */ '~/pages/event/admit.vue').then((m) => m.default || m);
const EventEdit = () => import(/* webpackChunkName: "basic-manage" */ '~/pages/event/edit/index.vue').then((m) => m.default || m);
const EventEditNews = () => import(/* webpackChunkName: "basic-manage" */ '~/pages/event/edit/news.vue').then((m) => m.default || m);
const EventEditStack = () => import( /* webpackChunkName: "basic-manage" */ '~/pages/event/edit/stack.vue').then((m) => m.default || m);


const About = () => import(/* webpackChunkName: "basic" */ '~/pages/about.vue').then((m) => m.default || m);
const New = () => import(/* webpackChunkName: "basic" */ '~/pages/new.vue').then((m) => m.default || m);
const Setting = () => import(/* webpackChunkName: "client-setting" */ '~/pages/setting.vue').then((m) => m.default || m);
const Subscription = () => import(/* webpackChunkName: "client-setting" */ '~/pages/subscription.vue').then((m) => m.default || m);
const Verify = () => import(/* webpackChunkName: "client-setting" */ '~/pages/verify.vue').then((m) => m.default || m);

const Register = () => import(/* webpackChunkName: "login" */ '~/pages/login/register.vue').then((m) => m.default || m);
const Login = () => import(/* webpackChunkName: "login" */ '~/pages/login/index.vue').then((m) => m.default || m);
const LoginAuth = () => import(/* webpackChunkName: "login" */ '~/pages/login/auth.vue').then((m) => m.default || m);
const LoginEmail = () => import(/* webpackChunkName: "login" */ '~/pages/login/email.vue').then((m) => m.default || m);

const AdminEvent = () => import(/* webpackChunkName: "admin" */ '~/pages/admin/event.vue').then((m) => m.default || m);
const AdminClient = () => import(/* webpackChunkName: "admin" */ '~/pages/admin/client.vue').then((m) => m.default || m);
const NotFound = () =>
  import( /* webpackChunkName: "404" */ '~/pages/404.vue').then((m) => m.default || m);


Vue.use(Router);

export function createRouter() {
  const router = new Router({
    mode: 'history',
    routes: [
      // basic
      { path: '/', component: Homepage, name: 'homepage' },
      { path: '/about', component: About, name: 'about' },
      { path: '/new', component: New, name: 'new' },

      // login
      { path: '/login', component: Login, name: 'login' },
      { path: '/login/auth', component: LoginAuth, name: 'login-auth' },
      { path: '/login/email', component: LoginEmail, name: 'login-email' },
      { path: '/register', component: Register, name: 'register' },

      // client setting
      { path: '/setting', component: Setting, name: 'setting' },
      { path: '/subscription', component: Subscription, name: 'subscription' },
      { path: '/verify', component: Verify, name: 'verify' },

      // admin
      { path: '/admin/event', component: AdminEvent, name: 'admin-event' },
      { path: '/admin/client', component: AdminClient, name: 'admin-client' },
      { path: '/admin/:any(.*)', component: NotFound, name: 'admin-not-found' },

      // event
      { path: '/:name(\\d+)/post', component: EventPost, name: 'event-post' },
      { path: '/:name(\\d+)/admit', component: EventAdmit, name: 'event-admit' },
      { path: '/:name(\\d+)/edit', component: EventEdit, name: 'event-edit' },
      { path: '/:name(\\d+)/edit/stack', component: EventEditStack, name: 'event-edit-stack' },
      { path: '/:name(\\d+)/edit/news/:id(\\d+)', component: EventEditNews, name: 'event-edit-news' },
      {
        path: '/:name(\\d+)',
        component: Event,
        name: 'event',
        children: [
          {
            path: ':stack(\\d+)',
            component: EventPlaceholder,
            name: 'event-stack',
          },
          {
            path: ':stack(\\d+)/:news(\\d+)',
            component: EventPlaceholder,
            name: 'event-stack-news',
          },
        ],
      },
      { path: '*', component: NotFound, name: 'not-found' },
    ],
  });

  router.afterEach((to, from) => {
    // TODO: API change
    // const fromFullPath = from.fullPath;
    const toFullPath = to.fullPath;
    if (typeof __ENDERMAN_REPORTER__ !== 'undefined') {
      __ENDERMAN_REPORTER__.reportLocationChange(toFullPath);
    }
  });

  return router;
}
