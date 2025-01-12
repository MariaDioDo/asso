<template>
  <div class="inscripcion-container">
    <h1>Inscripción al Evento: <span>{{ event.name }}</span></h1>

    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-group">
        <label for="nombreEquipo">Nombre del equipo</label>
        <input
          id="nombreEquipo"
          v-model="formData.nombreEquipo"
          type="text"
          placeholder="Ingresa el nombre de tu equipo"
          required
        />
      </div>

      <div class="form-group file-upload">
        <label for="logoEquipo">Agregar logo</label>
        <input
          id="logoEquipo"
          type="file"
          accept="image/*"
          @change="handleLogoUpload"
          required
        />
        <div v-if="formData.logo" class="logo-preview">
          <img :src="formData.logoUrl" alt="Logo del equipo" />
        </div>
      </div>
      <p v-if="!isTeamFull" class="error-message">
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
              <th>Teléfono</th>
              <th>Licenciatura</th>
              <th>Tipo de Sangre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in formData.integrantes" :key="index">
              <td>{{ member.nombre }}</td>
              <td>{{ member.apellidoPaterno }}</td>
              <td>{{ member.apellidoMaterno }}</td>
              <td>{{ member.noCuenta }}</td>
              <td>{{ member.telefono }}</td>
              <td>{{ member.licenciatura }}</td>
              <td>{{ member.tipoSangre }}</td>
              <td>
                <button @click="editMember(index)" class="action-button edit">✏️</button>
                <button @click="deleteMember(index)" class="action-button delete">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="button-group">
        <button type="button" @click="openModal" class="add-member-button">Agregar Integrante</button>
        <button type="button" @click="goBack" class="cancel-button">Cancelar</button>
        <button type="submit" class="submit-button" :disabled="!isTeamFull">Inscribir Equipo</button>
      </div>
    </form>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>Formulario de Integrante</h2>
        <form @submit.prevent="addMember">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input id="nombre" v-model="newMember.nombre" type="text" required />
          </div>
          <div class="form-group">
            <label for="apellidoPaterno">Apellido Paterno</label>
            <input id="apellidoPaterno" v-model="newMember.apellidoPaterno" type="text" required />
          </div>
          <div class="form-group">
            <label for="apellidoMaterno">Apellido Materno</label>
            <input id="apellidoMaterno" v-model="newMember.apellidoMaterno" type="text" required />
          </div>
          <div class="form-group">
            <label for="noCuenta">No. Cuenta</label>
            <input id="noCuenta" v-model="newMember.noCuenta" type="text" required />
          </div>
          <div class="form-group">
            <label for="telefono">Teléfono</label>
            <input id="telefono" v-model="newMember.telefono" type="tel" required />
          </div>
          <div class="form-group">
            <label for="licenciatura">Licenciatura</label>
            <input id="licenciatura" v-model="newMember.licenciatura" type="text" required />
          </div>
          <div class="form-group">
            <label for="tipoSangre">Tipo de Sangre</label>
            <input id="tipoSangre" v-model="newMember.tipoSangre" type="text" required />
          </div>
          <button type="submit" class="submit-button">Añadir</button>
          <button type="button" @click="closeModal" class="cancel-button">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      event: {}, // Detalles del evento
      formData: {
        nombreEquipo: '',
        logo: null,
        logoUrl: null, 
        integrantes: [],
        correoContacto: '',
      },
      newMember: {
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        noCuenta: '',
        telefono: '',
        licenciatura: '',
        tipoSangre: '',
      },
      memberFields: [
        { id: 'nombre', label: 'Nombre', model: 'nombre', type: 'text', placeholder: 'Nombre' },
        { id: 'apellidoPaterno', label: 'Apellido Paterno', model: 'apellidoPaterno', type: 'text', placeholder: 'Apellido Paterno' },
        { id: 'apellidoMaterno', label: 'Apellido Materno', model: 'apellidoMaterno', type: 'text', placeholder: 'Apellido Materno' },
        { id: 'noCuenta', label: 'No. Cuenta', model: 'noCuenta', type: 'text', placeholder: 'Número de Cuenta' },
        { id: 'telefono', label: 'Teléfono', model: 'telefono', type: 'tel', placeholder: 'Teléfono' },
        { id: 'licenciatura', label: 'Licenciatura', model: 'licenciatura', type: 'text', placeholder: 'Licenciatura' },
        { id: 'tipoSangre', label: 'Tipo de Sangre', model: 'tipoSangre', type: 'text', placeholder: 'Tipo de Sangre' },
      ],
      showModal: false,
      errors: {},
    };
  },
  computed: {
    isTeamFull() {
    return this.event.team_size 
      ? this.formData.integrantes.length === this.event.team_size
      : true;
  },
  },
  created() {
    const eventId = this.$route.params.id;
    this.fetchEvent(eventId);
  },
  methods: {
    async fetchEvent(id) {
      try {
        const response = await fetch(`http://localhost:5000/events/${id}`);
        const data = await response.json();
        if (data) {
          this.event = data;
        } else {
          this.error = 'Evento no encontrado.';
        }
      } catch (err) {
        this.error = 'Error al cargar el evento: ' + err.message;
      }
    },
    handleLogoUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        this.formData.logo = file;
        this.formData.logoUrl = URL.createObjectURL(file); // Crear URL para la imagen
      } else {
        alert('Por favor, selecciona un archivo de imagen válido.');
        event.target.value = '';
      }
    },
    addMember() {
      this.errors = {};
      const valid = Object.values(this.newMember).every((field) => field);
      if (valid) {
        this.formData.integrantes.push({ ...this.newMember });
        this.newMember = {
          nombre: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          noCuenta: '',
          telefono: '',
          licenciatura: '',
          tipoSangre: '',
        };
        this.closeModal();
      } else {
        alert('Por favor, completa todos los campos.');
      }
    },
    editMember(index) {
      this.newMember = { ...this.formData.integrantes[index] };
      this.formData.integrantes.splice(index, 1);
      this.openModal();
    },
    deleteMember(index) {
      this.formData.integrantes.splice(index, 1);
    },
    async submitForm() {
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
    goBack() {
      this.$router.push(`/eventos/${this.event.id}`);
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
/* Colores principales */
:root {
  --primary-green: #4caf50;
  --dark-green: #388e3c;
  --light-green: #c8e6c9;
  --gray: #f5f5f5;
  --text-gray: #616161;
}

/* General */
.inscripcion-container {
  font-family: 'Arial', sans-serif;
  padding: 20px;
  background-color: var(--gray);
  color: var(--text-gray);
  border-radius: 10px;
}

h1, h2 {
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
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}
.error-message {
  color: rgb(15, 71, 3);
  font-size: 0.9em;
  margin-top: 10px;
}
</style>