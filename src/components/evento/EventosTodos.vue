<template>
  <div class="eventos-container">
    <div class="eventos-lista">
      <div 
        v-for="evento in eventos" 
        :key="evento.id" 
        class="evento-item"
        @click="openDetail(evento.id)"
      >
        <img :src="evento.image" alt="Imagen del evento" class="evento-imagen" />
        <div class="evento-detalle">
          <h3 class="evento-titulo">{{ evento.name }}</h3>
          <p class="evento-fecha" v-if="evento.fecha">{{ evento.fecha }}</p>
          <p class="evento-descripcion">{{ evento.description }}</p>
        </div>
      </div>
    </div>
    <div v-if="loading" class="loading">Cargando más eventos...</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      eventos: [],
      loading: false,
      limit: 3,
    };
  },
  methods: {
    openDetail(id) {
      this.$router.push(`/eventos/${id}`);
    },
    async fetchEventos() {
      try {
        const response = await fetch("http://localhost:5000/events");
        const data = await response.json();
        console.log("Datos obtenidos:", data); // Revisa el formato
        this.eventos = data; // Ajusta esto si los datos son un array directo
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      }
    }
  },
  created() {
    this.fetchEventos();
  }
};
</script>

<style scoped>
/* Contenedor principal más ancho */
.eventos-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  max-width: 1400px; /* Cambia el ancho máximo a un valor mayor (ajústalo según tu necesidad) */
  width: 90%; /* Hace que ocupe el 90% del ancho de la pantalla */
  margin: 20px auto; /* Centra el contenedor */
}


/* Lista de eventos */
.eventos-lista {
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: none; /* Oculta el scroll en Firefox */
  -ms-overflow-style: none; /* Oculta el scroll en IE */
  gap: 0;
}

.eventos-lista::-webkit-scrollbar {
  display: none; /* Oculta el scroll en Chrome, Safari y Edge */
}


/* Elemento de evento */
.evento-item {
  display: flex;
  align-items: center; /* Centra verticalmente la descripción */
  justify-content: flex-start; /* Asegura que los elementos se alineen correctamente */
  padding: 10px; /* Reduce el espacio interno del rectángulo */
  margin: 10px 0; /* Reduce el espacio entre los elementos */
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

/* Imágenes */
.evento-imagen {
  width: 100px; /* Reduce el tamaño de la imagen */
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
}

/* Contenedor de detalles */
.evento-detalle {
  padding-left: 15px; /* Reduce el espacio entre la imagen y el texto */
}

/* Títulos */
.evento-titulo {
  font-size: 1em; /* Reduce el tamaño de la fuente */
  margin: 0 0 5px; /* Reduce el espacio inferior */
}

/* Fecha */
.evento-fecha {
  font-size: 0.85em; /* Reduce el tamaño de la fuente */
  margin: 0 0 5px; /* Reduce el espacio inferior */
}

/* Descripción */
.evento-descripcion {
  font-size: 0.9em; /* Reduce el tamaño de la fuente */
  line-height: 1.2; /* Ajusta el espacio entre líneas */
}

</style>