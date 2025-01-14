<template>
  <div class="inscripcion-container">
    <h1>Inscripción al Evento: <span>{{ event.name }}</span></h1>

    <form @submit.prevent="submitForm" class="form-container">

      <div class="form-group file-upload">
        <div class="logo-space" @click="triggerFileInput" :style="formData.logoUrl ? 'cursor: pointer;' : ''">
          <div v-if="formData.logoUrl" class="logo-preview">
            <img :src="formData.logoUrl" alt="Logo del equipo" />
          </div>
          <div v-else>
            <p>Haz clic para agregar un logo</p>
          </div>
          <input ref="logoInput" id="logoEquipo" type="file" accept="image/*" @change="handleLogoUpload"
            style="display: none" />
        </div>
        <p v-if="imageError" class="error-message">{{ imageError }}</p>
      </div>

      <div class="form-group">
        <label for="nombreEquipo">Nombre del equipo</label>
        <input id="nombreEquipo" v-model="formData.nombreEquipo" type="text"
          placeholder="Ingresa el nombre de tu equipo" required />
        <p v-if="errors.username" class="error-message">{{ errors.username }}</p>
      </div>

      <p v-if="!isTeamFull && formData.integrantes.length > 0" class="error-message">
        El número de integrantes debe ser exactamente {{ event.team_size }}.
      </p>

      <div class="table-container">
        <h2>Integrantes del equipo</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>No. Cuenta</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Licenciatura</th>
              <th>Tipo de Persona</th>
              <th>Tipo de Sangre</th>
              <th>NSS</th>
              <th>Alergias</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in formData.integrantes" :key="index">
              <td>{{ member.username }}</td>
              <td>{{ member.lastName }}</td>
              <td>{{ member.secondLastName }}</td>
              <td>{{ member.accountNumber }}</td>
              <td>{{ member.email }}</td>
              <td>{{ member.phone }}</td>
              <td>{{ member.degree }}</td>
              <td>{{ member.personType }}</td>
              <td>{{ member.bloodType }}</td>
              <td>{{ member.nss }}</td>
              <td>{{ member.allergies }}</td>
              <td>
                <button v-if="!isCurrentUser(member)" @click="editMember(index)" class="action-button edit">✏️
                </button>
                <button v-if="!isCurrentUser(member)" @click="deleteMember(index)" class="action-button delete">🗑️
                </button>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <div class="button-group">
        <button type="button" @click="openModal" class="add-member-button">Agregar Integrante</button>
        <button type="button" @click="goBack" class="cancel-button">Cancelar</button>
        <button type="submit" class="submit-button" :disabled="!isTeamFull"
          :class="{ 'disabled-button': !isTeamFull }">Inscribir Equipo</button>
      </div>
    </form>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>Formulario de Integrante</h2>
        <form @submit.prevent="addMember">
          <div class="form-group">
            <label for="username">Nombre de usuario:</label>
            <input type="text" id="username" v-model="newMember.username" required />
            <p v-if="errors.username" class="error-message">{{ errors.username }}</p>
          </div>
          <div class="form-group">
            <label for="lastName">Apellido Paterno:</label>
            <input type="text" id="lastName" v-model="newMember.lastName" required />
            <p v-if="errors.lastName" class="error-message">{{ errors.lastName }}</p>
          </div>
          <div class="form-group">
            <label for="secondLastName">Apellido Materno:</label>
            <input type="text" id="secondLastName" v-model="newMember.secondLastName" required />
            <p v-if="errors.secondLastName" class="error-message">{{ errors.secondLastName }}</p>
          </div>
          <div class="form-group">
            <label for="email">Correo:</label>
            <input type="text" id="email" v-model="newMember.email" required />
            <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
          </div>
          <div class="form-group">
            <label for="accountNumber">Número de cuenta:</label>
            <input type="text" id="accountNumber" v-model="newMember.accountNumber" required />
            <p v-if="errors.accountNumber" class="error-message">{{ errors.accountNumber }}</p>
          </div>
          <div class="form-group">
            <label for="phone">Teléfono:</label>
            <input type="text" id="phone" v-model="newMember.phone" required />
            <p v-if="errors.phone" class="error-message">{{ errors.phone }}</p>
          </div>
          <div class="form-group">
            <label for="nss">NSS:</label>
            <input type="text" id="nss" v-model="newMember.nss" required />
            <p v-if="errors.nss" class="error-message">{{ errors.nss }}</p>
          </div>
          <div class="form-group">
            <label for="allergies">Alergias:</label>
            <input type="text" id="allergies" v-model="newMember.allergies" required />
            <p v-if="errors.allergies" class="error-message">{{ errors.allergies }}</p>
          </div>

          <!-- Campo para Tipo de Persona -->
          <div class="form-group">
            <label for="personType">Tipo de Persona:</label>
            <select id="personType" v-model="newMember.personType" required>
              <option v-for="type in personTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="degree">Licenciatura:</label>
            <select id="degree" v-model="newMember.degree" required>
              <option v-for="degree in degrees" :key="degree" :value="degree">{{ degree }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="bloodType">Tipo de Sangre:</label>
            <select id="bloodType" v-model="newMember.bloodType" required>
              <option v-for="type in bloodTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>

          <div class="buttons-editar">
            <button type="submit" class="submit-button">
              {{ isEditing ? 'Guardar' : 'Añadir' }}
            </button>
            <button type="button" @click="closeModal" class="cancel-button">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      event: {},
      formData: {
        nombreEquipo: '',
        logoUrl: null,
        logo: null,
        integrantes: [],
      },
      newMember: {
        username: "",
        lastName: "",
        secondLastName: "",
        degree: "",
        personType: "",
        bloodType: "",
        email: "",
        accountNumber: "",
        allergies: "",
        phone: "",
        nss: "",
      },
      showModal: false,
      errors: {},
      isEditing: false,
      degrees: ["ICO", "IEL", "IME", "ICI", "ISES", "IIA"],
      personTypes: ["Estudiante", "Profesor", "Academico"],
      bloodTypes: ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"],
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    isTeamFull() {
      if (!this.event || !this.event.team_size) {
        return false;
      }
      return this.isEditing ? false : this.formData.integrantes.length >= this.event.team_size;
    }

  },
  created() {
    const eventId = this.$route.params.id;
    this.fetchEvent(eventId);
  },
  mounted() {
    this.fetchEvent(this.$route.params.id).then(() => {
      if (this.event.team_size && this.getUser) {
        this.formData.integrantes.unshift({
          username: this.getUser.username,
          lastName: this.getUser.lastName,
          secondLastName: this.getUser.secondLastName,
          accountNumber: this.getUser.accountNumber,
          phone: this.getUser.phone,
          degree: this.getUser.degree,
          bloodType: this.getUser.bloodType,
          email: this.getUser.email,
          personType: this.getUser.personType,
          nss: this.getUser.nss,
          allergies: this.getUser.allergies,
        });
      } else {
        console.error('Error: evento o usuario no cargados correctamente.');
      }
    });
  },

  methods: {

    goBack() {
      this.$router.push(`/eventos/${this.event.id}`);
    },

    async submitForm() {
      if (!this.event.team_size) {
        alert('El tamaño del equipo no está definido. Por favor, inténtalo más tarde.');
        return;
      }
      if (this.formData.integrantes.length !== this.event.team_size) {
        alert(`El equipo debe tener exactamente ${this.event.team_size} integrantes.`);
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/inscripciones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventId: this.event.id,
            nombreEquipo: this.formData.nombreEquipo,
            logo: this.formData.logo ? this.formData.logo.name : null,
            integrantes: this.formData.integrantes,
            correoContacto: this.formData.correoContacto,
          }),
        });

        if (response.ok) {
          alert('Inscripción enviada correctamente');
          this.$router.push('/eventos');
        } else {
          const errorData = await response.json();
          this.error = errorData.message || 'Error al enviar la inscripción.';
        }
      } catch (err) {
        this.error = 'Error al procesar la inscripción: ' + err.message;
      }
    },

    editMember(index) {
      if (index >= 0 && index < this.formData.integrantes.length) {
        this.isEditing = true;
        console.log('Editando miembro en el índice:', index);

        const memberToEdit = this.formData.integrantes[index];
        console.log('Miembro a editar:', memberToEdit);
        this.newMember = { ...memberToEdit };
        this.openModal();
      } else {
        console.error("Índice de miembro no válido:", index);
      }
    },

    // TODO: ELIMINAR MIEMBRO
    deleteMember(index) {
      const removedMember = this.formData.integrantes.splice(index, 1);
      console.log("Miembro eliminado:", removedMember[0]);
    },
    isCurrentUser(member) {
      return member.accountNumber === this.getUser?.accountNumber;
    },

    triggerFileInput() {
      this.$refs.logoInput.click();
    },

    async fetchEvent(id) {
      try {
        const response = await fetch(`http://localhost:5000/events/${id}`);
        const data = await response.json();
        if (data && data.team_size) {
          this.event = data;
        } else {
          console.error('La respuesta del servidor no contiene team_size:', data);
        }
      } catch (error) {
        console.error('Error al obtener el evento:', error);
      }
    },

    handleLogoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
        if (validImageTypes.includes(file.type)) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.formData.logoUrl = e.target.result;
            this.imageError = null;
          };
          reader.readAsDataURL(file);
        } else {
          this.imageError = 'Por favor, selecciona un archivo de imagen válido (JPEG, PNG, GIF, BMP, WebP).';
        }
      }
    },

    openModal() {
      this.showModal = true;
      this.errors = {};
    },

    closeModal() {
      this.showModal = false;
      this.errors = {};
    },

    addMember() {
      if (this.isEditing) {
        // Si estamos editando, no agregamos un nuevo integrante, solo actualizamos el existente
        const indexToEdit = this.formData.integrantes.findIndex(member => member.accountNumber === this.newMember.accountNumber);
        if (indexToEdit !== -1) {
          this.formData.integrantes[indexToEdit] = { ...this.newMember };
          console.log("Miembro editado:", this.formData.integrantes[indexToEdit]);
          this.closeModal();
        }
      } else {
        // Si no estamos editando, validamos y agregamos un nuevo integrante
        if (this.validateNewMember()) {
          if (this.formData.integrantes.length < this.event.team_size) {
            this.formData.integrantes.push({ ...this.newMember });
            console.log("Miembro agregado:", this.formData.integrantes);
            this.closeModal();  // Cerrar el modal después de agregar
          } else {
            alert(`El equipo ya tiene el máximo permitido (${this.event.team_size} integrantes).`);
          }
        } else {
          // Si la validación falla, no cerramos el modal
          console.log("Errores de validación:", this.errors);
        }
      }
    },

    validateNewMember() {
      let isValid = true;
      this.errors = {}; // Limpiar los errores previos
      console.log('Validando el formulario...');

      // Validación nombre de usuario
      const lettersRegex = /^[A-Za-z\s]+$/;
      if (!this.newMember.username || !lettersRegex.test(this.newMember.username)) {
        this.errors.username = "El nombre de usuario solo debe contener letras.";
        isValid = false;
      }
      // Validar alergias (opcional, pero solo letras si se ingresa)
      if (this.newMember.allergies && !lettersRegex.test(this.newMember.allergies)) {
        this.errors.allergies = "Las alergias deben contener solo letras.";
        isValid = false;
      }

      // Validación apellidos
      if (!this.newMember.lastName || !lettersRegex.test(this.newMember.lastName)) {
        this.errors.lastName = "El apellido paterno solo debe contener letras.";
        isValid = false;
      }
      if (!this.newMember.secondLastName || !lettersRegex.test(this.newMember.secondLastName)) {
        this.errors.secondLastName = "El apellido materno solo debe contener letras.";
        isValid = false;
      }

      // Validación email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!this.newMember.email || !emailRegex.test(this.newMember.email)) {
        this.errors.email = "El correo electrónico debe ser válido.";
        isValid = false;
      } this.formData.integrantes.forEach((integrante) => {
        if (integrante.email === this.newMember.email) {
          this.errors.email = "El correo ya existe";
          isValid = false;
        }
      })

      // Validación teléfono
      const phoneRegex = /^\d{10}$/;
      if (!this.newMember.phone || !phoneRegex.test(this.newMember.phone)) {
        this.errors.phone = "El número de teléfono debe contener 10 dígitos numéricos.";
        isValid = false;
      }

      // Validación NSS
      const nssRegex = /^\d{11}$/;
      if (!this.newMember.nss || !nssRegex.test(this.newMember.nss)) {
        this.errors.nss = "El NSS debe contener 11 dígitos.";
        isValid = false;
      }
      this.formData.integrantes.forEach((integrante) => {
        if (integrante.nss === this.newMember.nss) {
          this.errors.nss = "El nss está repetido";
          isValid = false;
        }
      })

      // Validar número de cuenta (7 dígitos numéricos)
      const accountNumberRegex = /^\d{7}$/;
      if (!this.newMember.accountNumber) {
        this.errors.accountNumber = "El número de cuenta es obligatorio.";
        isValid = false;
      } else if (!accountNumberRegex.test(this.newMember.accountNumber)) {
        this.errors.accountNumber = "El número de cuenta debe tener exactamente 7 dígitos.";
        isValid = false;
      }
      this.formData.integrantes.forEach((integrante) => {
        if (integrante.accountNumber === this.newMember.accountNumber) {
          this.errors.accountNumber = "El numero de cuenta no puede estar repetido";
          isValid = false;
        }
      })
      return isValid;
    },

  },
};
</script>

<style scoped>
:root {
  --primary-green: #4caf50;
  --dark-green: #388e3c;
  --light-green: #c8e6c9;
  --gray: #f5f5f5;
  --text-gray: #616161;
}

.inscripcion-container {
  font-family: 'Arial', sans-serif;
  padding: 20px;
  background-color: var(--gray);
  color: var(--text-gray);
  border-radius: 10px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
}

h1,
h2 {
  color: var(--primary-green);
}

h1 span {
  font-weight: bold;
  color: var(--dark-green);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
}

input[type='text'],
input[type='tel'],
input[type='file'] {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--dark-green);
  border-radius: 5px;
}

input[type='file'] {
  background-color: var(--light-green);
}


table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table th,
table td {
  border: 1px solid var(--dark-green);
  padding: 10px;
  text-align: left;
}

table th {
  background-color: var(--light-green);
}

.action-button {
  border: none;
  cursor: pointer;
  font-size: 16px;
  background: none;
  padding: 5px;
}

.action-button {
  display: flex;
  /* Asegúrate de que no esté en "display: none;" */
}


.action-button.edit {
  color: var(--primary-green);
}

.action-button.delete {
  color: red;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.buttons-modal {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.add-member-button,
.submit-button {
  background-color: #388e3c;
  color: white;
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button {
  background-color: #e0e0e0;
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  opacity: 0.9;
}

.add-member-button:hover,
.submit-button:hover {
  background-color: #2c6f2b;
}

.cancel-button:hover {
  background-color: #bdbdbd;
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  /* Asegura que el contenido pueda desplazarse si excede la pantalla */
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 95%;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-width: 400px;
  }
}

.error-message {
  color: rgb(232, 45, 51);
  font-size: 0.9em;
  margin-top: 10px;
}

.parent-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.file-upload {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.logo-space {
  width: 200px;
  height: 200px;
  border: 2px solid var(--dark-green);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 8px;
}

.logo-space p {
  text-align: center;
}

.logo-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

input[type="file"] {
  display: none;
}

.action-button {
  padding: 10px 15px;
  margin: 10px 0;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.action-button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
  /* Cambia el cursor a "no permitido" */
}

.info-message {
  color: #555;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.form-container {
  margin-top: 20px;
}
</style>