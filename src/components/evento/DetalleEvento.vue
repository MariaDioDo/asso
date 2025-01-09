<template>
  <div v-if="event" class="event-container">
    <div class="event-card">
      <h1 class="event-title">{{ event.name }}</h1>
      <p class="event-id">Evento: {{ event.id }}</p>

      <div class="event-image">
        <img :src="event.image" alt="Imagen del evento" />
      </div>

      <div class="event-description">
        <p>{{ event.description }}</p>
      </div>

      <!-- Botones -->
      <div class="button-container">
        <button class="back-button" @click="goBack">Ir a eventos</button>
        <button class="signup-button" @click="inscribir">Inscribirse</button>
      </div>
    </div>
  </div>

  <div v-else-if="loading">
    <div class="loading-container">
      <p>Loading...</p>
    </div>
  </div>

  <div v-else>
    <div class="error-container">
      <p class="error-message">Evento no encontrado o hubo un error al cargar los detalles.</p>
      <p class="error-info">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      event: null, // Para almacenar el evento seleccionado
      error: null, // Para manejar posibles errores
      loading: true
    };
  },

  created() {
    const eventId = this.$route.params.id;  // Obtener el ID del evento desde la URL
    this.fetchEvent(eventId);  // Llamar a fetchEvent pasando el ID
  },

  methods: {
    async fetchEvent(id) {
      try {
        // Realiza la solicitud para obtener el evento específico por su ID
        const response = await fetch(`http://localhost:5000/events/${id}`); // URL de la API para obtener un evento por ID
        const data = await response.json();

        if (data) {
          this.event = data;  // Asignamos el evento recibido a 'event'
          this.loading = false;
        } else {
          this.error = 'Evento no encontrado';
          this.loading = false;
          console.error(this.error);
        }
      } catch (err) {
        this.error = 'Error al obtener el evento: ' + err.message;
        this.loading = false;  // Desactiva el estado de carga
        console.error(this.error);
      }
    },
    goBack() {
      // Regresar a la página de lista de eventos
      this.$router.push('/eventos');
    },
    inscribir() {
      // Acción de inscripción
      alert("Te has inscrito en el evento");
    }
  }
};
</script>

<style scoped>
.event-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  padding: 20px;
}

.event-card {
  background-color: #fff;
  border-radius: 10px;
  width: 100%; /* Asegura que la tarjeta ocupe el 100% del contenedor */
  max-width: 1200px;
  min-width: 800px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease;
  position: relative; /* Necesario para posicionar los botones */
  display: flex;
  flex-direction: column;
}
.event-card:hover {
  transform: scale(1.05);
}

.event-title {
  font-size: 2.5rem; /* Título más grande */
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.event-id {
  font-size: 1rem;
  color: #777;
  text-align: center;
  margin-bottom: 15px;
}

.event-image img {
  width: 100%; /* Asegura que la imagen ocupe el 100% del contenedor */
  height: auto; /* Mantiene la proporción de la imagen */
  max-height: 400px; /* Limita la altura máxima */
  max-width: 100%; /* Asegura que la imagen no exceda el contenedor */
  object-fit: contain; /* Ajusta la imagen sin recortarla */
  border-radius: 10px;
  margin-bottom: 20px;
}

.event-description {
  font-size: 1.2rem;
  color: #555;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: space-between; /* Distribuye los botones, dejando uno a la izquierda y el otro centrado */
  align-items: center;
  width: 100%; /* Asegura que el contenedor ocupe todo el ancho disponible */
  margin-top: 20px;
}

.back-button {
  background-color: #28a745; /* Botón verde */
  color: white;
  border: none;
  padding: 6px 12px; /* Botón más pequeño */
  font-size: 0.9rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: absolute; /* Hace que el botón se posicione en relación a su contenedor */
  top: 10px; /* Lo coloca en la parte superior */
  left: 10px; /* Lo coloca en la parte izquierda */
}

.signup-button {
  background-color: #32cd32; /* Botón verde brillante */
  color: white;
  border: none;
  padding: 15px 30px;  /* Botón más grande */
  font-size: 1.3rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 200px; /* Fija un ancho para el botón */
  margin: 20px auto 0; /* Centrado en la parte inferior con margen superior */
  display: block; /* Asegura que se comporte como bloque para centrarlo */
}


.signup-button:hover {
  background-color: #28a745;
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 50px;
}

.error-message {
  font-size: 1.5rem;
  color: #e74c3c;
  font-weight: bold;
}

.error-info {
  font-size: 1.2rem;
  color: #555;
  margin-top: 10px;
}
</style>
