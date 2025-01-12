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
  .dashboard-layout {
    padding: 20px;
  }
  </style>
  