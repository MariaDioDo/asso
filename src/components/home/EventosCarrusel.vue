<template>
  <div class="carousel-container">
    <div class="carousel">
      <div
        class="carousel-item"
        v-for="(event, index) in events"
        :key="index"
        v-show="isVisible(index)"
      >
        <!-- Asegúrate de que la URL sea correcta y esté enlazada correctamente -->
        <img v-bind:src="event.image" alt="Event Image" class="carousel-image" />
        <div class="event-info">
          <h3>{{ event.name }}</h3>
          <p>{{ event.description }}</p>
          <button @click="openDetail(event.id)" class="detalle-link">
            Ver Detalle
          </button>
        </div>
      </div>
    </div>
    
    <div class="buttons">
      <button @click="prev">Anterior</button>
      <button @click="next">Siguiente</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      events: [], // Aquí se cargarán los datos dinámicos
      currentIndex: 0,
      itemsPerPage: 3, // Número de eventos visibles en cada paso del carrusel
    };
  },
  created() {
    this.fetchEvents(); // Obtén los eventos al cargar el componente
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await fetch("http://localhost:5000/events");
        if (response.ok) {
          this.events = await response.json();
        } else {
          console.error("Error al obtener los eventos:", response.statusText);
        }
      } catch (error) {
        console.error("Error al obtener los eventos:", error);
      }
    },
    openDetail(id) {
      const url = `/eventos/${id}`;
      window.open(url, "_blank"); // Redirige a la vista de detalle
    },
    next() {
      this.currentIndex =
        this.currentIndex + this.itemsPerPage < this.events.length
          ? this.currentIndex + this.itemsPerPage
          : 0;
    },
    prev() {
      this.currentIndex =
        this.currentIndex - this.itemsPerPage >= 0
          ? this.currentIndex - this.itemsPerPage
          : Math.max(this.events.length - this.itemsPerPage, 0);
    },
    isVisible(index) {
      return (
        index >= this.currentIndex &&
        index < this.currentIndex + this.itemsPerPage
      );
    },
  },
};
</script>

<style scoped>
.carousel-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4fdf8;
  padding: 30px 0;
}

.carousel {
  display: flex;
  overflow: hidden;
  width: 95%;
  margin-bottom: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 128, 0, 0.2);
  background-color: #e7f4e7;
  justify-content: space-between;
  height: 60vh; 
  align-items: center;
}

.carousel-item {
  flex: 0 0 30%; 
  height: 90%; 
  margin: 0 20px; 
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center; 
  background-color: #fcfcfc;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.carousel-item img {
  width: 100%; 
  height: 100%;
  object-fit: cover; 
  border-radius: 10px 10px 0 0; 
}

.carousel-image {
  width: 80%; 
  height: auto; 
  object-fit: cover; 
  border-radius: 10px 10px 0 0; 
  border-bottom: 4px solid #4caf50; 
}

.carousel-item:hover {
  transform: translateY(-5px); 
  box-shadow: 0 4px 15px rgba(0, 128, 0, 0.3); 
}

.event-info {
  padding: 10px;
  text-align: center;
}

.event-info h3 {
  font-size: 1.2em;
  color: #2e7d32; 
  margin-bottom: 5px;
}

.event-info p {
  font-size: 0.9em;
  color: #555; 
}

.buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

button {
  background-color: #4caf50; 
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 25px; 
  font-size: 16px;
  transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out;
}

button:hover {
  background-color: #388e3c; 
  transform: scale(1.05); 
}

button:focus {
  outline: none;
}
</style>
