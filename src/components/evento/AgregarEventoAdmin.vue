<template>
    <div v-if="event">
      <h1>Editar Evento: {{ event.name }}</h1>
      <form @submit.prevent="guardarCambios">
        <label for="name">Nombre:</label>
        <input v-model="event.name" type="text" id="name" required />
  
        <label for="description">Descripción:</label>
        <textarea v-model="event.description" id="description" required></textarea>
  
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
    <div v-else>
      <p>Cargando evento...</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        event: null,
      };
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
          this.event = data;
        } catch (error) {
          console.error('Error al obtener el evento:', error);
        }
      },
      async guardarCambios() {
        try {
          const response = await fetch(`http://localhost:5000/events/${this.event.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.event)
          });
  
          if (response.ok) {
            this.$router.push('/eventos'); // Redirigir a la lista de eventos
          } else {
            console.error('Error al guardar los cambios');
          }
        } catch (error) {
          console.error('Error al guardar los cambios:', error);
        }
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
  