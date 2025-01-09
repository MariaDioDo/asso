import { createApp } from 'vue';
import App from './components/Layouts/MainLayout.vue'; // Asegúrate de que este archivo sea correcto
import router from '@/components/router/routeNavebar';
import routerEventos from '@/components/router/routeEventos';
import store from './components/sesion/indexUser';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BootstrapVue3 } from 'bootstrap-vue-3';
import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App);

app.use(router); // Asegúrate de usar el router
app.use(routerEventos);
app.use(BootstrapVue3);
app.use(store);
app.mount('#app');
