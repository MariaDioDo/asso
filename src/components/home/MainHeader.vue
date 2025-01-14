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
        <li v-if="!isAuthenticated">
          <router-link to="/eventos" class="nav-link" :class="{ active: isActive('/eventos') }">Eventos</router-link>
        </li>
        <!-- Mostrar 'Eventos' según el tipo de usuario -->
        <li v-if="isAuthenticated">
          <!-- Mostrar el enlace según el tipo de usuario -->
          <router-link v-if="getUserType === 'Administrador'" to="/eventosEditar" class="nav-link"
            :class="{ active: isActive('/eventosEditar') }">Eventos</router-link>
          <router-link v-else to="/eventos" class="nav-link"
            :class="{ active: isActive('/eventos') }">Eventos</router-link>
        </li>
        <li>
          <router-link to="/resultados" class="nav-link"
            :class="{ active: isActive('/resultados') }">Resultados</router-link>
        </li>

        <!-- Mostrar 'Perfil' según el tipo de usuario -->
        <li v-if="isAuthenticated">
          <!-- Mostrar el enlace según el tipo de usuario -->
          <router-link v-if="getUserType === 'Administrador'" to="/perfilAdministrador" class="nav-link"
            :class="{ active: isActive('/perfilAdministrador') }">Perfil Administrador</router-link>
          <router-link v-else to="/perfilUsuario" class="nav-link"
            :class="{ active: isActive('/perfilUsuario') }">Perfil Usuario</router-link>
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
    ...mapGetters(['isAuthenticated', 'getUserType']), 
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
  color: rgb(29, 126, 60);
}
</style>
