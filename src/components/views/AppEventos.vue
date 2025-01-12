<template>
    <div class="eventos-container">
      <div class="eventos-lista">
        <EventosTodos/>
      </div>
    </div>
  </template>
  
  <script>
import EventosTodos from '../evento/EventosTodos.vue';

  export default {
    name: 'AppEventos',
    components: {
    EventosTodos,
  },
  };
  </script>
  <style scoped>
  .eventos-container {
    padding: 0; 
    background-color: transparent; 
    box-shadow: none; 
    border-radius: 0; 
  }
  .eventos-container h1 {
  font-size: 2em;
  color: #333;
  margin: 10px 0;
}

</style>  