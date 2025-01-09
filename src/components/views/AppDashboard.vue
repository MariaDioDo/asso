<template>
    <div class="dashboard">
      <h3>Dashboard</h3>
      <router-view />
  </div>
</template>
  
<script>
export default {
  name: 'AppDashboard',
};
</script>

<style scoped>
.dashboard-layout {
  padding: 20px;
}
</style>