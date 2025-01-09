<template>
  <div class="perfil-container">
    <!-- Verifica si el usuario está autenticado -->
    <div v-if="user">
      <div class="user-info">
        <!-- Imagen de Perfil (hacemos clic en la imagen para abrir el selector de archivo) -->
        <div class="profile-image-container">
          <img 
            :src="user.profileImage || defaultImage" 
            alt="Imagen de Perfil" 
            class="profile-image" 
            @click="triggerFileInput" 
          />

          <!-- Input oculto para cargar la imagen -->
          <input 
            type="file" 
            ref="fileInput" 
            class="image-upload" 
            @change="handleImageUpload" 
            accept="image/*" 
            style="display: none;"
          />
        </div>

        <!-- Campos de texto que se pueden editar -->
        <div class="editable-fields">
          <label>Nombre:</label>
          <input v-if="isEditing" v-model="user.username" type="text" />
          <span v-else>{{ user.username }}</span>

          <label>Apellido Paterno:</label>
          <input v-if="isEditing" v-model="user.lastName" type="text" />
          <span v-else>{{ user.lastName }}</span>

          <label>Apellido Materno:</label>
          <input v-if="isEditing" v-model="user.secondLastName" type="text" />
          <span v-else>{{ user.secondLastName }}</span>

          <label>Tipo de Sangre:</label>
          <select v-if="isEditing" v-model="user.bloodType">
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          <span v-else>{{ user.bloodType }}</span>

          <label>Email:</label>
          <input v-if="isEditing" v-model="user.email" type="email" />
          <span v-else>{{ user.email }}</span>

          <label>Alergias:</label>
          <input v-if="isEditing" v-model="user.allergies" type="text" />
          <span v-else>{{ user.allergies }}</span>

          <!-- Datos no editables (como el ID de usuario) -->
          <label>Carrera:</label>
          <span>{{ user.degree }}</span> <!-- Este campo no es editable -->
          <label>Número de Cuenta:</label>
          <span>{{ user.accountNumber }}</span>
          <label>Tipo de usuario:</label>
          <span>{{ user.personType }}</span>
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
import { mapGetters, mapActions  } from 'vuex';

export default {
  name: "PerfilUsuario",
  data() {
    return {
      defaultImage: 'https://via.placeholder.com/150', // Imagen predeterminada si no hay imagen de perfil
      imageError: null, // Para manejar errores de tipo de archivo
      isEditing: false, // Estado para verificar si se está editando el perfil
      originalUser: null, // Para almacenar el estado original del usuario y restaurarlo si es necesario
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    user() {
      return this.getUser; // Accede al usuario desde el store
    },
    isAuthenticated() {
      return !!this.user; // Verifica si el usuario está autenticado
    }
  },
  created() {
    // Verifica si el usuario está autenticado al cargar la página
    if (!this.user && localStorage.getItem('user')) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      this.$store.commit('setUser', storedUser);  // Cargar el usuario del localStorage al store
    }
    this.originalUser = { ...this.user }; // Guardar una copia del usuario original
  },
  methods: {
  ...mapActions(['updateUser', 'logout']),
  editProfile() {
    this.isEditing = true; // Cambiar el estado a edición
  },
  saveProfile() {
    this.updateUser(this.user);
    // Guardar los cambios
    this.$store.commit('setUser', { ...this.user });

    // Ocultar el campo de edición
    this.isEditing = false;

    // Regresar a los botones de "Editar" y "Cerrar sesión"
    localStorage.setItem('user', JSON.stringify(this.user)); // Guardar cambios en localStorage
  },
  cancelEdit() {
    // Restaurar el usuario al estado original (antes de editar)
    this.$store.commit('setUser', { ...this.originalUser });
    this.isEditing = false; // Volver al estado sin edición

    // Restaurar los datos en el localStorage
    localStorage.setItem('user', JSON.stringify(this.originalUser)); 
  },
  logout() {
    this.$store.dispatch('logout');
    localStorage.removeItem('user'); // Limpia la sesión persistente
    this.$router.push('/login'); // Redirige al login después de hacer logout
  },
  triggerFileInput() {
    // Solo permitir la selección de archivo si estamos en modo de edición
    if (this.isEditing) {
      this.$refs.fileInput.click();
    }
  },
  handleImageUpload(event) {
    const file = event.target.files[0];
    
    if (file) {
      // Validación de tipo MIME para imágenes
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
      
      if (validImageTypes.includes(file.type)) {
        // Si el tipo de archivo es válido, lo procesamos
        const reader = new FileReader();
        reader.onload = (e) => {
          this.$store.commit('setUser', { ...this.user, profileImage: e.target.result });
          this.imageError = null; // Limpiar el error si la imagen es válida
        };
        reader.readAsDataURL(file);
      } else {
        // Si el archivo no es una imagen válida, mostramos un mensaje de error
        this.imageError = 'Por favor, selecciona un archivo de imagen válido (JPEG, PNG, GIF, BMP, WebP).';
      }
    }
  }
},
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
  margin-bottom: 20px;
}

.editable-fields label {
  font-weight: bold;
  margin-top: 10px;
}

.editable-fields input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.editable-fields span {
  display: block;
  padding: 8px;
  background-color: #f4f4f4;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-top: 5px;
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
  background-color: #4caf50; /* Verde para el botón de guardar */
}

.save-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  margin-top: 20px;
  background-color: #f44336; /* Rojo para el botón de cancelar */
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
