<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/images/logo.jpg" alt="Logo" />
    </div>
    <nav>
      <ul class="nav-menu">
        <li>
          <router-link to="/" class="nav-link" :class="{ active: isActive('/') }">Inicio</router-link>
        </li>
        <li>
          <router-link to="/eventos" class="nav-link" :class="{ active: isActive('/eventos') }">Eventos</router-link>
        </li>
        <li>
          <router-link to="/dashboard" class="nav-link" :class="{ active: isActive('/dashboard') }">Dashboard</router-link>
        </li>
        <li>
          <router-link to="/resultados" class="nav-link" :class="{ active: isActive('/resultados') }">Resultados</router-link>
        </li>

        <!-- Mostrar 'Perfil' si el usuario está autenticado -->
        <li v-if="isAuthenticated">
          <router-link to="/perfilUsuario" class="nav-link" :class="{ active: isActive('/perfilUsuario') }">Perfil</router-link>
        </li>

        <!-- Mostrar 'Iniciar sesión' si no está autenticado -->
        <li v-if="!isAuthenticated">
          <router-link to="/login" class="nav-link" :class="{ active: isActive('/login') }">Iniciar sesión</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "MainHeader",
  computed: {
    ...mapGetters(['isAuthenticated']),
    isActive() {
      return (route) => this.$route.path === route;
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1b3e08;
  padding: 10px 20px;
}

.logo img {
  height: 50px;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 20px;
  color: white;
  margin-left: auto;
}

.nav-menu li {
  cursor: pointer;
}

.nav-link.active {
  font-weight: bold;
  color: rgb(29, 126, 60); /* Ejemplo para destacar el enlace activo */
}
</style>
