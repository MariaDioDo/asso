<template>
  <div class="auth-container">
    <h1>Iniciar Sesión</h1>
    <form @submit.prevent="handleLogin" class="auth-form">
      <div class="form-group">
        <label for="email">Correo electrónico:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="accountNumber">Número de cuenta:</label>
        <input type="text" id="accountNumber" v-model="accountNumber" required />
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button @click="ir" type="submit" class="btn-login">Iniciar Sesión</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
    <p class="signup-link">
      ¿No tienes una cuenta? <router-link to="/register">Crear Cuenta</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      email: "",
      accountNumber: "",
      password: "",
      errorMessage: "",
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated']), // Obtiene el estado de autenticación del store
  },
  methods: {
    ...mapActions(['login']), // Conectar la acción login de Vuex
    async handleLogin() {
      this.errorMessage = ""; // Reinicia el mensaje de error
      try {
        // Llamada a la API para obtener usuarios y administradores
        const [usuariosResponse, administradoresResponse] = await Promise.all([
          axios.get("http://localhost:5000/usuarios"),
          axios.get("http://localhost:5000/administradores"),
        ]);

        // Busca el usuario en los dos arrays
        const usuario = usuariosResponse.data.find(
          u => u.email === this.email && u.accountNumber === this.accountNumber
        );
        const administrador = administradoresResponse.data.find(
          a => a.email === this.email && a.accountNumber === this.accountNumber
        );

        // Verifica que las credenciales coincidan
        if (usuario && usuario.password === this.password) {
          // Si es un usuario, almacena el tipo como 'Usuario'
          this.$store.dispatch('login', { user: usuario, userType: 'Usuario' });
          localStorage.setItem('user', JSON.stringify(usuario));
          this.$router.push('/perfilUsuario');
        } else if (administrador && administrador.password === this.password) {
          // Si es un administrador, almacena el tipo como 'Administrador'
          this.$store.dispatch('login', { user: administrador, userType: 'Administrador' });
          localStorage.setItem('user', JSON.stringify(administrador));
          this.$router.push('/perfilAdministrador');
        } else {
          this.errorMessage = "Credenciales incorrectas.";
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        this.errorMessage = "Error de conexión. Intenta nuevamente.";
      }
    },
    ir() {
      this.$router.push('/perfilUsuario'); // Redirige al login después de iniciar sesion
    }
  },
};
</script>


<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 20vh;
  background-color: #f4f7fc;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.auth-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  font-size: 1rem;
  color: #555;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 4px;
  border: 1px solid #cccccc;
  font-size: 1rem;
}

button.btn-login {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.btn-login:hover {
  background-color: #45a049;
}

.signup-link {
  margin-top: 15px;
  text-align: center;
}

.signup-link router-link {
  color: #4CAF50;
  font-weight: bold;
  text-decoration: none;
}

.signup-link router-link:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
}
</style>
