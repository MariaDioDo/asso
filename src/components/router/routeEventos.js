import DefaultLayout from '@/components/Layouts/DefaultLayout.vue';
import AppEventos from '@/components/views/AppEventos.vue';
import DetalleEvento from '@/components/evento/DetalleEvento.vue';

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
    ],
  },
];
