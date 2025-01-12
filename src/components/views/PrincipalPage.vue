<template>
  <div>
    <div class="contenido-principal">
      <PostHeader />
      <div class="carousel-section">
        <EventosCarrusel />
      </div>
    </div>
 </div>
</template>

<script>
import EventosCarrusel from '../home/EventosCarrusel.vue';
import PostHeader from '../home/PostHeader.vue';


export default {
  name: 'PrincipalPage',
  components: {
    EventosCarrusel,
    PostHeader,
  },
};
</script>


<style scoped>
.contenido-principal {
  padding: 20px;
  background-color: #f5f5f5;
  text-align: center; 
}

h1 {
  font-size: 2em;
  color: #2e7d32;
  margin-bottom: 20px;
}

.carousel-section {
  margin: 0 auto;
  max-width: 1200px; 
}

.carousel-wrapper {
  display: flex;
  justify-content: center; 
  gap: 20px; 
}

.carousel-buttons {
  margin-top: 15px;
  display: flex;
  justify-content: center; 
  gap: 10px;
}

button {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #45a049;
}

</style>