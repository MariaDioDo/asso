<template>
  <div class="description-container">
    <div class="description-content">
      <div class="description-text">
        <h2>Promotoría Deportiva de la Facultad de Ingeniería</h2>
        <p>
          ¡Bienvenido a la página de la promotoría deportiva de la facultad de ingeniería de la UAEMex!
          Aquí encontrarás información de los torneos organizados en la facultad y podrás inscribirte a ellos.
        </p>
      </div>
      <div class="description-image">
        <img
          src="@/assets/images/1.jpg"
          alt="Imagen de Evento"
          class="description-img"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostHeader",
};
</script>

<style scoped>
.description-container {
  width: 100%;
  height: 100vh;
  padding: 0; 
  margin: 0; 
  display: flex;
  justify-content: center;
  align-items: center; 
}

.description-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; 
  height: 100%; 
}

.description-text {
  width: 50%; 
  padding: 0 20px 0 70px;
  color: #333; 
}

.description-text h2 {
  font-size: 3em; 
  color: #2e7d32; 
  margin-bottom: 50px;
}

.description-text p {
  font-size: 1.2em; 
  color: #555;
}

.description-image {
  width: 60%; 
  display: flex;
  justify-content: center;
}

.description-img {
  width: 70%; 
  height: auto; 
  object-fit: cover; 
  
}

@media (max-width: 768px) {
  .description-content {
    flex-direction: column;
  }

  .description-text {
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
  }

  .description-image {
    width: 100%;
    text-align: center;
  }
}
</style>
