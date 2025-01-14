<template>
  <div class="perfil-container">
    <!-- Verifica si el usuario está autenticado -->
    <div v-if="user">
      <div class="user-info">
        <!-- Imagen de Perfil (hacemos clic en la imagen para abrir el selector de archivo) -->
        <div class="profile-image-container">
          <img :src="user.profileImage || defaultImage" alt="Imagen de Perfil" class="profile-image"
            @click="triggerFileInput" />

          <!-- Input oculto para cargar la imagen -->
          <input type="file" ref="fileInput" class="image-upload" @change="handleImageUpload" accept="image/*"
            style="display: none;" />
        </div>

        <!-- Campos de texto que se pueden editar -->
        <div class="editable-fields">
          <label>Nombre:</label>
          <input v-if="isEditing" v-model="user.nombre" type="text" />
          <span v-else>{{ user.nombre }}</span>
          <div v-if="errors.nombre" class="error">{{ errors.nombre }}</div>

          <label>Apellido Paterno:</label>
          <input v-if="isEditing" v-model="user.apellidoPaterno" type="text" />
          <span v-else>{{ user.apellidoPaterno }}</span>
          <div v-if="errors.apellidoPaterno" class="error">{{ errors.apellidoPaterno }}</div>

          <label>Apellido Materno:</label>
          <input v-if="isEditing" v-model="user.apellidoMaterno" type="text" />
          <span v-else>{{ user.apellidoMaterno }}</span>
          <div v-if="errors.apellidoMaterno" class="error">{{ errors.apellidoMaterno }}</div>

          <label>Tipo de Sangre:</label>
          <select v-if="isEditing" v-model="user.tipoSangre" class="blood-type">
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          <span v-else>{{ user.tipoSangre }}</span>

          <label>Email:</label>
          <input v-if="isEditing" v-model="user.correo" type="email" class="email-field" />
          <span v-else>{{ user.correo }}</span>
          <div v-if="errors.correo" class="error">{{ errors.correo }}</div>

          <label>Alergias:</label>
          <input v-if="isEditing" v-model="user.alergias" type="text" />
          <span v-else>{{ user.alergias }}</span>
          <div v-if="errors.alergias" class="error">{{ errors.alergias }}</div>

          <label>Teléfono:</label>
          <input v-if="isEditing" v-model="user.celular" type="text" />
          <span v-else>{{ user.celular }}</span>
          <div v-if="errors.celular" class="error">{{ errors.celular }}</div>

          <label>NSS:</label>
          <input v-if="isEditing" v-model="user.numeroSeguro" type="text" />
          <span v-else>{{ user.numeroSeguro }}</span>
          <div v-if="errors.numeroSeguro" class="error">{{ errors.numeroSeguro }}</div>

          <!-- Datos no editables (como el ID de usuario) -->
          <label>Carrera:</label>
          <span>{{ user.licenciatura }}</span>
          <label>Número de Cuenta:</label>
          <span>{{ user.numeroCuenta }}</span>
          <label>Tipo de usuario:</label>
          <span>{{ user.tipoPersona }}</span>
        </div>
      </div>

      <!-- Contenedor de los botones -->
      <div class="button-container" v-if="!isEditing">
        <button @click="editProfile" class="edit-btn">Editar Perfil</button>
        <button v-if="isAuthenticated" @click="logout" class="logout-btn">Cerrar sesión</button>
      </div>

      <div class="button-container" v-else>
        <button @click="saveProfile" class="save-btn">Guardar Cambios</button>
        <button @click="cancelEdit" class="cancel-btn">Cancelar</button>
      </div>
    </div>

    <div v-else>
      <p>No estás autenticado. Por favor, inicia sesión.</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  name: "PerfilUsuario",
  data() {
    return {
      defaultImage: 'https://via.placeholder.com/150',
      imageError: null,
      isEditing: false,
      originalUser: null,
      errors: {} // Contendrá los errores de validación
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    user() {
      return this.getUser;
    },
    isAuthenticated() {
      return !!this.user;
    }
  },
  created() {
    if (!this.user && localStorage.getItem('user')) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      console.log('Tipo de usuario al iniciar sesión:', storedUser.tipoPersona); // Verifica que esté aquí
      this.$store.commit('setUser', { user: storedUser, tipoPersona: storedUser.tipoPersona });
    }
    this.originalUser = { ...this.user, tipoPersona: this.user.tipoPersona };
  },
  methods: {
    ...mapActions(['updateUser', 'logout']),
    editProfile() {
      this.isEditing = true;
    },
    async saveProfile() {
      let isValid = true;
      this.errors = {}; // Limpiar los errores previos

      // Validación nombre
      const lettersRegex = /^[A-Za-z\s]+$/;
      if (!this.user.nombre || !lettersRegex.test(this.user.nombre)) {
        this.errors.nombre = "El nombre solo debe contener letras.";
        isValid = false;
      }
      // Validar alergias (opcional, pero solo letras si se ingresa)
      if (this.user.alergias && !lettersRegex.test(this.user.alergias)) {
        this.errors.alergias = "Las alergias deben contener solo letras.";
        isValid = false;
      }

      // Validación apellidos
      if (!this.user.apellidoPaterno || !lettersRegex.test(this.user.apellidoPaterno)) {
        this.errors.apellidoPaterno = "El apellido paterno solo debe contener letras.";
        isValid = false;
      }
      if (!this.user.apellidoMaterno || !lettersRegex.test(this.user.apellidoMaterno)) {
        this.errors.apellidoMaterno = "El apellido materno solo debe contener letras.";
        isValid = false;
      }

      // Validación email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!this.user.correo || !emailRegex.test(this.user.correo)) {
        this.errors.correo = "El correo electrónico debe ser válido.";
        isValid = false;
      } else if (this.user.correo !== this.originalUser.correo) {
        // Validar si el nuevo email ya está en uso
        const emailExists = await this.checkEmail(this.user.correo);
        if (emailExists) {
          this.errors.correo = "El correo electrónico ya está en uso.";
          isValid = false;
        }
      }

      // Validación teléfono
      const phoneRegex = /^\d{10}$/;
      if (!this.user.celular || !phoneRegex.test(this.user.celular)) {
        this.errors.celular = "El número de teléfono debe contener 10 dígitos numéricos.";
        isValid = false;
      }

      // Validación NSS
      const nssRegex = /^\d{11}$/;
      if (!this.user.numeroSeguro || !nssRegex.test(this.user.numeroSeguro)) {
        this.errors.numeroSeguro = "El NSS debe contener 11 dígitos.";
        isValid = false;
      } else if (this.user.numeroSeguro !== this.originalUser.numeroSeguro) {
        // Validar si el nuevo NSS ya está en uso
        const nssExists = await this.checkNSS(this.user.numeroSeguro);
        if (nssExists) {
          this.errors.numeroSeguro = "El NSS ya está en uso.";
          isValid = false;
        }
      }

      // Si los datos son válidos, actualizar
      if (isValid) {
        this.updateUser(this.user);
        this.$store.commit('setUser', { ...this.user });

        // Actualizar en localStorage
        localStorage.setItem('user', JSON.stringify({ ...this.user, tipoPersona: this.getTipoPersona }));

        const tipoPersona = this.user.tipoPersona || 'Usuario';  

        this.$store.commit('setUser', { user: { ...this.originalUser }, tipoPersona }); // Poner un tipoPersona por defecto
        this.isEditing = false;
      }
    },
    cancelEdit() {
      this.isEditing = false;
      this.user = { ...this.originalUser };
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.user.profileImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    // Funciones de validación asíncronas
    async checkEmail(email) {
      // Lógica para verificar si el correo electrónico ya está en uso
      try {
        const response = await axios.get(`https://54d77e44-31b5-4be6-9ea7-0ebc4d8ab30b.mock.pstmn.io/participantes
?correo=${email}`);
        return response.data.exists;
      } catch (error) {
        console.error("Error verificando el correo: ", error);
        return false;
      }
    },
    async checkNSS(nss) {
      // Lógica para verificar si el NSS ya está en uso
      try {
        const response = await axios.get(`https://54d77e44-31b5-4be6-9ea7-0ebc4d8ab30b.mock.pstmn.io/participantes
?numeroSeguro=${nss}`);
        return response.data.exists;
      } catch (error) {
        console.error("Error verificando el NSS: ", error);
        return false;
      }
    }
  }
};
</script>

<style scoped>
.perfil-container {
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  position: relative;
  width: 90%;
  max-width: 500px;
  margin: 0 auto;
}

h2 {
  color: #1b3e08;
  text-align: center;
}

.user-info {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.profile-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.image-upload {
  padding: 5px;
  background-color: #1b3e08;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.editable-fields {
  margin-bottom: 4px;
}

.editable-fields label,
.editable-fields select,
.editable-fields input {
  display: block;
}

.editable-fields label {
  margin-bottom: 2px;
}

.editable-fields input,
.editable-fields select {
  margin-bottom: 12px;
  padding: 8px;
  box-sizing: border-box;
  width: 100%;
}

.editable-fields input {
  width: 100%;
  border: 1px solid #ccc;

}

.editable-fields span {
  display: block;
  margin-bottom: 12px;
  padding: 8px;
  background-color: #f4f4f4;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-top: 5px;
  box-sizing: border-box;
}

button {
  background-color: #1b3e08;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
}

button:hover {
  background-color: #3a6a30;
}

.save-btn {
  margin-top: 20px;
  background-color: #4caf50;
}

.save-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  margin-top: 20px;
  background-color: #f44336;
}

.cancel-btn:hover {
  background-color: #d32f2f;
}

.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.edit-btn {
  background-color: #4eb038;
}

.edit-btn:hover {
  background-color: #49b344;
}

.logout-btn {
  background-color: #f44336;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

.image-error {
  color: red;
  margin-top: 10px;
}
</style>
