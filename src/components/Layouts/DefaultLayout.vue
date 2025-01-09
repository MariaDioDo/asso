<template>
  <div>
    <!-- Aquí solo se cargará el contenido específico de cada ruta -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
};
</script>

  
  <style scoped>
  /* Estilos específicos para el layout del Dashboard */
  .dashboard-layout {
    padding: 20px;
  }
  </style>
  