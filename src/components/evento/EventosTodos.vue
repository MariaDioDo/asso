<template>
  <div class="eventos-container">
    <div class="eventos-lista">
      <div 
        v-for="evento in eventos" 
        :key="evento.idEvento" 
        class="evento-item"
        @click="openDetail(evento.idEvento)"
      >
        <img :src="evento.image" alt="Imagen del evento" class="evento-imagen" />
        <div class="evento-detalle">
          <h3 class="evento-titulo">{{ evento.titulo }}</h3>
          <p class="evento-fecha" v-if="evento.fechaInicial">{{ evento.fechaInicial }} - {{ evento.fechaFinal }}</p>
          <p class="evento-descripcion">{{ evento.descripcion }}</p>
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
      console.log(`Redirigiendo al evento con id: ${id}`);
      this.$router.push(`/eventos/${id}`);  // Navegar a la página del evento con el id
    },
    async fetchEventos() {
      try {
        const response = await fetch("https://54d77e44-31b5-4be6-9ea7-0ebc4d8ab30b.mock.pstmn.io/eventos");
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
.eventos-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  max-width: 1400px; 
  width: 90%; 
  margin: 20px auto;
}


.eventos-lista {
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: none; 
  -ms-overflow-style: none; 
  gap: 0;
}

.eventos-lista::-webkit-scrollbar {
  display: none; 
}


.evento-item {
  display: flex;
  align-items: center; 
  justify-content: flex-start; 
  padding: 10px; 
  margin: 10px 0; 
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.evento-imagen {
  width: 100px; 
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
}

.evento-detalle {
  padding-left: 15px; 
}

.evento-titulo {
  font-size: 1em; 
  margin: 0 0 5px; 
}

.evento-fecha {
  font-size: 0.85em; 
  margin: 0 0 5px; 
}

.evento-descripcion {
  font-size: 0.9em; 
  line-height: 1.2; 
}

</style>