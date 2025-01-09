<template>
  <div id="app">
    <!-- Componente de encabezado común -->
    <MainHeader />
  
    <!-- Contenedor del contenido principal -->
    <main class="main-content">
      <router-view />
    </main>
  
    <!-- Componente de pie de página común -->
    <AppFooter />
  </div>
</template>
  
<script>
import MainHeader from '@/components/home/MainHeader.vue'; // Encabezado
import AppFooter from '@/components/home/AppFooter.vue';   // Pie de página
  
export default {
  name: 'MainLayout',
  components: {
    MainHeader,
    AppFooter,
  },
};
</script>
  
<style>
/* Diseño principal */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Altura mínima para ocupar toda la pantalla */
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}

/* Contenido principal entre header y footer */
.main-content {
  flex: 1; /* Ocupa el espacio restante entre header y footer */
  padding: 20px; /* Espaciado interno */
  background-color: #f5f5f5; /* Color de fondo opcional */
}

/* Títulos secundarios */
h2 {
  font-size: 24px;
  margin-bottom: 10px;
}
</style>
