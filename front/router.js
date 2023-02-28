import VueRouter from 'vue-router';

import Navigation from "./components/Navigation";
import Login from "./components/pages/login/Login";
import NotFound from "./components/pages/NotFound";
import Users from "./components/pages/Users";
import Viewer from "./components/pages/Viewer";
import UploadIPS from "./components/pages/UploadIPS";


const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/app/',
      component: Navigation,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'users',
          component: Users,
        },
        {
          path: 'viewer',
          component: Viewer,
        },
        {
          path: 'uploadIPS',
          component: UploadIPS,
        },
        {
          path: '*',
          component: NotFound,
        },

      ]
    },
    {
      path: '*',
      component: Login,
    },
  ]
});

export default router;
