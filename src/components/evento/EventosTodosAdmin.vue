<template>
  <div class="eventos-container">
    <div v-if="eventos.length === 0" class="sin-eventos">
      <p>No hay eventos disponibles.</p>
      <button @click="abrirFormulario('crear')">Crear evento</button>
    </div>

    <div v-else>
      <div class="botones-crud">
        <button @click="abrirFormulario('crear')">Agregar evento</button>
      </div>

      <div class="eventos-lista">
        <div v-for="evento in eventos" :key="evento.id" class="evento-item">
          <img :src="evento.image" alt="Imagen del evento" class="evento-imagen" />
          <div class="evento-detalle">
            <h3 class="evento-titulo">{{ evento.name }}</h3>
            <p class="evento-descripcion">{{ evento.description }}</p>
          </div>
          <div class="botones-acciones">
            <button @click="abrirFormulario('editar', evento.id)">Editar</button>
            <button @click="eliminarEvento(evento.id)">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">Cargando eventos...</div>

    <!-- Modal para crear/editar -->
    <div v-if="mostrarFormulario" class="modal">
      <div class="modal-content">
        <h3>{{ modoFormulario === 'crear' ? 'Crear Evento' : 'Editar Evento' }}</h3>
        <form @submit.prevent="modoFormulario === 'crear' ? crearEvento() : actualizarEvento()">
          <label for="name">Título del evento</label>
          <input v-model="formulario.name" type="text" id="name" required />

          <label for="start_date">Fecha de inicio</label>
          <input v-model="formulario.start_date" type="date" id="start_date" required />

          <label for="end_date">Fecha de finalización</label>
          <input v-model="formulario.end_date" type="date" id="end_date" required />

          <label for="event_type">Tipo de evento</label>
          <select v-model="formulario.event_type" id="event_type" required>
            <option value="Torneo">Torneo</option>
            <option value="Actividad">Actividad</option>
            <option value="Conferencia">Conferencia</option>
          </select>

          <label for="description">Descripción</label>
          <textarea v-model="formulario.description" id="description" required></textarea>

          <label for="image">URL de la imagen</label>
          <input v-model="formulario.image" type="text" id="image" required />

          <!-- Condicional para Torneo: Número de integrantes por equipo -->
          <div v-if="formulario.event_type === 'Torneo'">
            <label for="team_size">Número de integrantes por equipo</label>
            <input v-model="formulario.team_size" type="number" id="team_size" min="1" required />
          </div>

          <button type="submit">Guardar</button>
          <button type="button" @click="cerrarFormulario">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      eventos: [],
      loading: false,
      mostrarFormulario: false,
      modoFormulario: "", // "crear" o "editar"
      formulario: {
        id: null,
        name: "",
        description: "",
        image: "",
        start_date: "", // Fecha de inicio
        end_date: "", // Fecha de finalización
        event_type: "Torneo", // Tipo de evento por defecto
        team_size: null, // Número de integrantes por equipo (solo para Torneo)
      },
    };
  },
  methods: {
    async fetchEventos() {
      try {
        this.loading = true;
        const response = await fetch("http://localhost:5000/events");
        const data = await response.json();
        this.eventos = data;
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      } finally {
        this.loading = false;
      }
    },
    abrirFormulario(modo, id = null) {
      this.mostrarFormulario = true;
      this.modoFormulario = modo;

      if (modo === "editar") {
        const evento = this.eventos.find((e) => e.id === id);
        this.formulario = { ...evento };

        // Si el tipo de evento no es "Torneo", vaciar el campo team_size
        if (this.formulario.type !== 'Torneo') {
          this.formulario.team_size = null;  // Borra el campo team_size si no es Torneo
        }
      } else {
        this.formulario = {
          id: null,
          name: "",
          description: "",
          image: "",
         // type: "",
          team_size: null,  // Asegúrate de incluir el campo team_size
        };
      }
    },
    cerrarFormulario() {
      this.mostrarFormulario = false;
    },
    async crearEvento() {
      try {
        const nuevoEvento = { ...this.formulario, id: Date.now().toString() };
        const response = await fetch("http://localhost:5000/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoEvento),
        });
        if (response.ok) {
          this.eventos.push(nuevoEvento);
          this.cerrarFormulario();
        }
      } catch (error) {
        console.error("Error al crear el evento:", error);
      }
    },
    async actualizarEvento() {
      try {
        // Eliminar el campo team_size si el evento no es un Torneo
        if (this.formulario.event_type !== 'Torneo') {
          delete this.formulario.team_size;
        }

        const response = await fetch(`http://localhost:5000/events/${this.formulario.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.formulario),
        });
        if (response.ok) {
          const index = this.eventos.findIndex((e) => e.id === this.formulario.id);
          this.eventos.splice(index, 1, this.formulario);
          this.cerrarFormulario();
        }
      } catch (error) {
        console.error("Error al actualizar el evento:", error);
      }
    },
    async eliminarEvento(id) {
      try {
        const response = await fetch(`http://localhost:5000/events/${id}`, { method: "DELETE" });
        if (response.ok) {
          this.eventos = this.eventos.filter((evento) => evento.id !== id);
        }
      } catch (error) {
        console.error("Error al eliminar el evento:", error);
      }
    },
  },
  created() {
    this.fetchEventos();
  },
};
</script>


<style scoped>
.sin-eventos {
  text-align: center;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.0em;
}

.sin-eventos p {
  font-size: 2em;
  margin-bottom: 20px;
}

.sin-eventos button {
  font-size: 1.0em;
  padding: 15px 30px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.sin-eventos button:hover {
  background-color: #45a049;
}

.eventos-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  max-width: 100%;
  height: 100vh;
  overflow: hidden;
  margin: 20px auto;
  position: relative;
}

.eventos-lista {
  max-height: 100%;
  overflow-y: auto;
  padding-right: 15px;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.eventos-lista::-webkit-scrollbar {
  width: 8px;
}

.eventos-lista::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.eventos-lista::-webkit-scrollbar-track {
  background-color: transparent;
}

.evento-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.evento-item:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.evento-imagen {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
}

.evento-detalle {
  padding-left: 15px;
  flex-grow: 1;
}

.evento-titulo {
  font-size: 1.2em;
  margin: 0 0 5px;
  color: #4CAF50;
  font-weight: bold;
}

.evento-descripcion {
  font-size: 0.9em;
  line-height: 1.2;
  color: #555;
}

.botones-acciones {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.botones-acciones button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s;
}

.botones-acciones button:hover {
  background-color: #45a049;
}

.botones-crud {
  margin-bottom: 15px;
  text-align: right;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.modal-content h3 {
  margin-bottom: 20px;
  color: #4CAF50;
  font-size: 1.2em;
  text-align: center;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #4CAF50;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

input[type="text"],
textarea {
  font-size: 1em;
}

.modal-content button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-content button:hover {
  background-color: #45a049;
}

.modal-content button[type="button"] {
  background-color: #f44336;
}

.modal-content button[type="button"]:hover {
  background-color: #e53935;
}
</style>
