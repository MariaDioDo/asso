import { createRouter, createWebHistory } from 'vue-router';
import PrincipalPage from '@/components/views/PrincipalPage.vue';
import AppDashboard from '@/components/views/AppDashboard.vue';
import AppResultados from '@/components/views/AppResultados.vue';

// Importa los layouts
import DefaultLayout from '@/components/Layouts/DefaultLayout.vue'; // Layout sin los encabezados
import routeEventos from '@/components/router/routeEventos';

// Importar para las sesiones de usuarios 
import CrearCuenta from '../sesion/CrearCuenta.vue';
import IniciarSesion from '../sesion/IniciarSesion.vue';
import PerfilUsuario from '../views/PerfilUsuario.vue';
import store from '../sesion/indexUser';

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'PrincipalPage',
        component: PrincipalPage,
      },
    ],
  },
  ...routeEventos,
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'AppDashboard',
        component: AppDashboard,
      },
    ],
  },
  {
    path: '/resultados',
    name: 'Resultados',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'AppResultados',
        component: AppResultados,
      },
    ],
  },
  {
    path: '/login',
    name: 'IniciarSesion',
    component: IniciarSesion, // Asociado correctamente
  },
  {
    path: '/perfilUsuario',
    name: 'PerfilUsuario',
    component: PerfilUsuario,
    meta: { requiresAuth: true }, // Solo accesible si está autenticado
  },
  {
    path: '/register',
    name: 'CrearCuenta',
    component: CrearCuenta,
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Verificar si el usuario está autenticado antes de acceder a rutas protegidas
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/perfilUsuario');
  } else {
    next();
  }
});


export default router;
