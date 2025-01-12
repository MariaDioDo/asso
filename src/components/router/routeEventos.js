import DefaultLayout from '@/components/Layouts/DefaultLayout.vue';
import AppEventos from '@/components/views/AppEventos.vue';
import DetalleEvento from '@/components/evento/DetalleEvento.vue';
import InscripcionEquipo from '../InscribirEquipo/InscripcionEquipo.vue';
import EventosTodosAdmin from '../evento/EventosTodosAdmin.vue';
import AgregarEventoAdmin from '../evento/AgregarEventoAdmin.vue';

export default [
  {
    path: '/eventos',
    name: 'Eventos',
    component: DefaultLayout,
    children: [
      {
        path: '', // Ruta para mostrar la lista de eventos
        name: 'AppEventos',
        component: AppEventos,
      },
      {
        path: '/eventos/:id', // Ruta para mostrar el detalle de un evento
        name: 'DetalleEvento',
        component: DetalleEvento,
      },
      {
        path: '/eventos/:id/inscripcion', // Ruta para la inscripción de equipos
        name: 'InscripcionEquipo',
        component: InscripcionEquipo,
        meta: { requiresAuth: true }, // Requiere autenticación
      },
      {
        path: '/eventosEditar',
        name: 'EventosTodosAdmin',
        component: EventosTodosAdmin,
        meta: { requiresAuth: true, requiresAdmin: true } // Solo accesible por administradores autenticados
      },   
      {
        path: '/eventosEditar/agregar',
        name: 'AgregarEventoAdmin',
        component: AgregarEventoAdmin,
        meta: { requiresAuth: true, requiresAdmin: true } // Solo accesible por administradores autenticados
      },   
    ],
  },
];
