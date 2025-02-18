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
                    <input v-if="isEditing" v-model="user.username" type="text" />
                    <span v-else>{{ user.username }}</span>
                    <div v-if="errors.username" class="error">{{ errors.username }}</div>

                    <label>Apellido Paterno:</label>
                    <input v-if="isEditing" v-model="user.lastName" type="text" />
                    <span v-else>{{ user.lastName }}</span>
                    <div v-if="errors.lastName" class="error">{{ errors.lastName }}</div>

                    <label>Apellido Materno:</label>
                    <input v-if="isEditing" v-model="user.secondLastName" type="text" />
                    <span v-else>{{ user.secondLastName }}</span>
                    <div v-if="errors.secondLastName" class="error">{{ errors.secondLastName }}</div>

                    <label>Email:</label>
                    <input v-if="isEditing" v-model="user.email" type="email" class="email-field" />
                    <span v-else>{{ user.email }}</span>
                    <div v-if="errors.email" class="error">{{ errors.email }}</div>

                    <label>Alergias:</label>
                    <input v-if="isEditing" v-model="user.allergies" type="text" />
                    <span v-else>{{ user.allergies }}</span>
                    <div v-if="errors.allergies" class="error">{{ errors.allergies }}</div>

                    <label>Teléfono:</label>
                    <input v-if="isEditing" v-model="user.phone" type="text" />
                    <span v-else>{{ user.phone }}</span>
                    <div v-if="errors.phone" class="error">{{ errors.phone }}</div>

                    <!-- Datos no editables (como el ID de usuario) -->
                    <label>Número de Cuenta:</label>
                    <span>{{ user.accountNumber }}</span>
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
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: "PerfilUsuarioAdmin",
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
        // Asegúrate de que el usuario se haya inicializado correctamente
        if (!this.user && localStorage.getItem('user')) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            console.log('Tipo de usuario al iniciar sesión:', storedUser.userType);
            this.$store.commit('setUser', { user: storedUser, userType: storedUser.userType });
        }

        // Establece originalUser con los valores del estado del store
        this.originalUser = { ...this.user, userType: this.userType };
    },
    methods: {
        ...mapActions(['updateUserAdmin', 'logout']),
        editProfile() {
            this.isEditing = true;
        },
        async saveProfile() {
            let isValid = true;
            this.errors = {}; // Limpiar los errores previos

            // Validación nombre de usuario
            const lettersRegex = /^[A-Za-z\s]+$/;
            if (!this.user.username || !lettersRegex.test(this.user.username)) {
                this.errors.username = "El nombre de usuario solo debe contener letras.";
                isValid = false;
            }
            // Validar alergias (opcional, pero solo letras si se ingresa)
            if (this.user.allergies && !lettersRegex.test(this.user.allergies)) {
                this.errors.allergies = "Las alergias deben contener solo letras.";
                isValid = false;
            }

            // Validación apellidos
            if (!this.user.lastName || !lettersRegex.test(this.user.lastName)) {
                this.errors.lastName = "El apellido paterno solo debe contener letras.";
                isValid = false;
            }
            if (!this.user.secondLastName || !lettersRegex.test(this.user.secondLastName)) {
                this.errors.secondLastName = "El apellido materno solo debe contener letras.";
                isValid = false;
            }

            // Validación email
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!this.user.email || !emailRegex.test(this.user.email)) {
                this.errors.email = "El correo electrónico debe ser válido.";
                isValid = false;
            } else if (this.user.email !== this.originalUser.email) {
                // Validar si el nuevo email ya está en uso
                const emailExists = await this.checkEmail(this.user.email);
                if (emailExists) {
                    this.errors.email = "El correo electrónico ya está en uso.";
                    isValid = false;
                }
            }

            // Validación teléfono
            const phoneRegex = /^\d{10}$/;
            if (!this.user.phone || !phoneRegex.test(this.user.phone)) {
                this.errors.phone = "El número de teléfono debe contener 10 dígitos numéricos.";
                isValid = false;
            }
            if (isValid) {
                this.updateUserAdmin(this.user);
                this.$store.commit('setUser', { ...this.user });

                // Actualizar en localStorage
                localStorage.setItem('user', JSON.stringify({ ...this.user, userType: this.getuserType }));

                // Asegúrate de pasar el userType al commit
                const userType = this.userType || 'Admninistrador';  // Asegúrate de que userType esté definido, usa un valor por defecto si es necesario

                this.$store.commit('setUser', { user: { ...this.originalUser }, userType }); // Pasa userType aquí
                this.isEditing = false;
            } else {
                // Si los datos no son válidos, loguea un mensaje de error o mantén en modo edición
                console.error("El formulario contiene errores. No se guardaron los cambios.");
            }
        },
        cancelEdit() {
            if (this.originalUser && Object.keys(this.originalUser).length > 0) {
                console.log('Guardando usuario en localStorage:', this.originalUser);
                localStorage.setItem('user', JSON.stringify({ ...this.user, userType: this.userType }));

                // Asegúrate de pasar el userType al commit
                const userType = this.userType || 'Administrador';  // Asegúrate de que userType esté definido, usa un valor por defecto si es necesario

                this.$store.commit('setUser', { user: { ...this.originalUser }, userType }); // Pasa userType aquí
                this.isEditing = false;
            } else {
                console.error("El usuario original está vacío o no está definido.");
            }
        },
        logout() {
            this.$store.dispatch('logout');
            localStorage.removeItem('user');
            this.$router.push('/login');
        },
        triggerFileInput() {
            if (this.isEditing) {
                this.$refs.fileInput.click();
            }
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
                if (validImageTypes.includes(file.type)) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        // Asegúrate de incluir el userType al actualizar el usuario
                        this.$store.commit('setUser', {
                            user: { ...this.user, profileImage: e.target.result },
                            userType: this.userType
                        });

                        // Limpia cualquier error de imagen previo
                        this.imageError = null;
                    };
                    reader.readAsDataURL(file);
                } else {
                    this.imageError = 'Por favor, selecciona un archivo de imagen válido (JPEG, PNG, GIF, BMP, WebP).';
                }
            }
        },
        async checkEmail(email) {
            try {
                const { data } = await axios.get(`http://localhost:5000/administradores?email=${email}`);
                return data.length > 0; // Devuelve true si ya existe
            } catch (error) {
                console.error("Error al verificar el correo electrónico:", error);
                return false; // Si hay un error, permite continuar con la validación
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