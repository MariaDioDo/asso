<template>
  <div v-if="event" class="event-container">
    <div class="event-card">
      <h1 class="event-title">{{ event.name }}</h1>

      <div class="event-image">
        <img :src="event.image" alt="Imagen del evento" />
      </div>

      <div class="event-description">
        <p>{{ event.description }}</p>
      </div>

      <!-- Botones -->
      <div class="button-container">
        <button class="back-button" @click="goBack">Ir a eventos</button>

        <!-- Mostrar botón "Inscribirse" solo si team_size tiene un número válido -->
        <button
          class="signup-button"
          v-if="isTeamSizeValid"
          @click="inscribir"
        >
          Inscribirse
        </button>
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
      <p class="error-message">
        Evento no encontrado o hubo un error al cargar los detalles.
      </p>
      <p class="error-info">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      event: null, // Evento cargado
      error: null, // Mensaje de error
      loading: true, // Estado de carga
    };
  },

  computed: {
    // Computada para validar si team_size es un número
    isTeamSizeValid() {
      return typeof this.event?.team_size === "number";
    },
  },

  created() {
    const eventId = this.$route.params.id; // Obtener el ID del evento desde la URL
    this.fetchEvent(eventId); // Llamar a fetchEvent pasando el ID
  },

  methods: {
    async fetchEvent(id) {
      try {
        const response = await fetch(`http://localhost:5000/events/${id}`); // URL de la API
        const data = await response.json();

        if (data) {
          this.event = data;
          this.loading = false;
        } else {
          this.error = "Evento no encontrado";
          this.loading = false;
        }
      } catch (err) {
        this.error = "Error al obtener el evento: " + err.message;
        this.loading = false;
      }
    },

    goBack() {
      // Regresar a la lista de eventos
      this.$router.push("/eventos");
    },

    inscribir() {
      const isAuthenticated = this.$store.getters.isAuthenticated; // Autenticación con Vuex
      if (isAuthenticated) {
        this.$router.push({
          name: "InscripcionEquipo",
          params: { id: this.event.id },
        });
      } else {
        this.$router.push("/login");
      }
    },
  },
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
  width: 100%; 
  max-width: 1200px;
  min-width: 800px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease;
  position: relative; 
  display: flex;
  flex-direction: column;
}
.event-card:hover {
  transform: scale(1.05);
}

.event-title {
  font-size: 2.5rem; 
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
  width: 100%; 
  height: auto; 
  max-height: 400px; 
  max-width: 100%; 
  object-fit: contain; 
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
  justify-content: space-between; 
  align-items: center;
  width: 100%; 
  margin-top: 20px;
}

.back-button {
  background-color: #28a745; 
  color: white;
  border: none;
  padding: 6px 12px;
  font-size: 0.9rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: absolute; 
  top: 10px; 
  left: 10px; 
}

.signup-button {
  background-color: #32cd32; 
  color: white;
  border: none;
  padding: 15px 30px; 
  font-size: 1.3rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 200px; 
  margin: 20px auto 0; 
  display: block; 
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
