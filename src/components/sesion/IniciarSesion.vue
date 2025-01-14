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
      <button type="submit" class="btn-login">Iniciar Sesión</button> <!-- Aquí no es necesario el @click="ir" -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
    <p class="signup-link">
      ¿No tienes una cuenta? <router-link to="/register">Crear Cuenta</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      email: "", // Para buscar en 'correo' para administradores
      accountNumber: "", // Para buscar en 'numeroCuenta'
      password: "", // Para buscar en 'password' para administradores
      errorMessage: "",
    };
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      this.errorMessage = ""; // Reinicia el mensaje de error
      try {
        const [usuariosResponse, administradoresResponse] = await Promise.all([
          axios.get("https://54d77e44-31b5-4be6-9ea7-0ebc4d8ab30b.mock.pstmn.io/participantes"),
          axios.get("https://54d77e44-31b5-4be6-9ea7-0ebc4d8ab30b.mock.pstmn.io/administradores"),
        ]);

        console.log('Usuarios:', usuariosResponse.data);
        console.log('Administradores:', administradoresResponse.data);

        // Busca el usuario solo si numeroCuenta no es null
        const usuario = usuariosResponse.data.find(
          u => u.numeroCuenta && u.numeroCuenta == this.accountNumber // Valida si numeroCuenta no es null
        );

        // Busca el administrador si los campos no son null
        const administrador = administradoresResponse.data.find(
          a =>
            a.correo === this.email &&
            a.numeroCuenta && a.numeroCuenta == this.accountNumber && // Valida numeroCuenta no nulo
            a.password === this.password
        );

        console.log('Usuario encontrado:', usuario);
        console.log('Administrador encontrado:', administrador);

        if (usuario) {
          console.log('Usuario autenticado correctamente');
          this.$store.dispatch('login', { user: usuario, userType: 'Usuario' });
          localStorage.setItem('user', JSON.stringify(usuario));
          this.$router.push('/perfilUsuario');
        } else if (administrador) {
          console.log('Administrador autenticado correctamente');
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
