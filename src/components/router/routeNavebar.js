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
import SeleccionUsuario from '../sesion/SeleccionUsuario.vue';
import CrearCuentaAdmin from '../sesion/CrearCuentaAdmin.vue';
import PerfilUsuarioAdmin from '../views/PerfilUsuarioAdmin.vue';

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
    path: '/perfilAdministrador',
    name: 'PerfilAdministrador',
    component: PerfilUsuarioAdmin,
    meta: { requiresAuth: true }, // Solo accesible si está autenticado
  },
  {
    path: '/register',
    name: 'SeleccionUsuario',
    component: SeleccionUsuario,
  },
  {
    path: "/CrearCuenta",
    name: "CrearCuenta",
    component: CrearCuenta,
  },
  {
    path: "/CrearCuentaAdmin",
    name: "CrearCuentaAdmin",
    component: CrearCuentaAdmin,
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  const userType = store.getters.getUserType;

  console.log("Intentando acceder a la ruta:", to.path);
  console.log("Autenticado:", isAuthenticated);
  console.log("Tipo de usuario:", userType);

  // Verifica si requiere autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    if (to.name === 'InscripcionEquipo') {
      console.log("No autenticado, redirigiendo a login para inscribirse...");
      next({ path: '/login', query: { redirect: to.fullPath } }); // Redirige a login con la ruta original
    } else {
      console.log("No autenticado, redirigiendo a login...");
      next('/login');
    }
  }
  // Verifica si requiere permisos de administrador
  else if (to.meta.requiresAdmin && userType !== 'Administrador') {
    console.log("No autorizado como Administrador, redirigiendo...");
    next('/');
  }
  // Si el usuario autenticado intenta acceder a /login, redirigir según su tipo
  else if (to.path === '/login' && isAuthenticated) {
    if (userType === 'Administrador') {
      console.log("Autenticado como Administrador, redirigiendo a perfilAdministrador...");
      next('/perfilAdministrador');
    } else {
      console.log("Autenticado como Usuario, redirigiendo a perfilUsuario...");
      next('/perfilUsuario');
    }
  }
  // Si el usuario está autenticado, permite acceder a otras rutas
  else {
    console.log("Ruta permitida, continuando...");
    next(); // Permite continuar
  }
});



export default router;