<template>
  <div>
    <h1>Lista de Torneos</h1>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Evento</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="torneo in torneos" :key="torneo.idTorneo">
          <td>{{ torneo.nombre }}</td>
          <td>{{ torneo.evento.titulo }}</td>
          <td>
            <button @click="mostrarEquipos(torneo.idTorneo)">Ver Equipos</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="equipoSeleccionado && mostrarModal">
      <h2>Equipos Inscritos en {{ torneoSeleccionado.nombre }}</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre del Equipo</th>
            <th>Participantes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="equipo in equiposFiltrados" :key="equipo.idEquipo">
            <td>{{ equipo.nombre }}</td>
            <td>
              <ul>
                <li v-for="participante in equipo.participantes" :key="participante.idParticipante">
                  {{ participante.nombre }}
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="cerrarModal">Cerrar</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      torneos: [], // Almacenará los torneos
      equipos: [], // Almacenará todos los equipos
      equiposFiltrados: [], // Equipos filtrados por torneo
      torneoSeleccionado: null, // Torneo seleccionado
      mostrarModal: false, // Controla el modal
    };
  },
  methods: {
    // Cargar torneos desde el backend
    async cargarTorneos() {
      try {
        const response = await axios.get("https://54d77e44-31b5-4be6-9ea7-0ebc4d8ab30b.mock.pstmn.io/torneos");
        this.torneos = response.data;
      } catch (error) {
        console.error("Error al cargar los torneos:", error);
      }
    },
    // Cargar equipos desde el backend
    async cargarEquipos() {
      try {
        const response = await axios.get("https://54d77e44-31b5-4be6-9ea7-0ebc4d8ab30b.mock.pstmn.io/equipos");
        this.equipos = response.data;
      } catch (error) {
        console.error("Error al cargar los equipos:", error);
      }
    },
    // Mostrar equipos inscritos a un torneo
    mostrarEquipos(idTorneo) {
      this.torneoSeleccionado = this.torneos.find((torneo) => torneo.idTorneo === idTorneo);
      this.equiposFiltrados = this.equipos.filter((equipo) => equipo.torneo.idTorneo === idTorneo);
      this.mostrarModal = true;
    },
    // Cerrar el modal
    cerrarModal() {
      this.mostrarModal = false;
      this.torneoSeleccionado = null;
      this.equiposFiltrados = [];
    },
  },
  mounted() {
    // Cargar los datos al montar el componente
    this.cargarTorneos();
    this.cargarEquipos();
  },
};
</script>
  
  <style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .modal {
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
    border-radius: 5px;
    width: 80%;
    max-width: 600px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
  </style>
  