<template>
    <div class="seleccion-usuario">
      <div class="card">
        <h2>Selecciona tu tipo de usuario</h2>
        <div class="button-container">
          <button @click="seleccionarUsuario('usuario')" class="btn usuario-btn">Usuario</button>
          <button @click="seleccionarUsuario('administrador')" class="btn admin-btn">Administrador</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "SeleccionUsuario",
    methods: {
      seleccionarUsuario(tipo) {
        if (tipo === "usuario") {
          this.$router.push("/CrearCuenta");
        } else if (tipo === "administrador") {
          this.$router.push("/CrearCuentaAdmin");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .seleccion-usuario {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #d4f5e9, #def9eb);
    font-family: 'Arial', sans-serif;
  }
  
  .card {
    background: #ffffff;
    padding: 30px 40px;
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    text-align: center;
  }
  
  .card h2 {
    margin-bottom: 20px;
    font-size: 1.8rem;
    color: #041f11;
  }
  
  .button-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }
  
  .btn {
    padding: 12px 25px;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.3s ease;
  }
  
  .usuario-btn {
    background: #48bb78;
    color: white;
  }
  
  .usuario-btn:hover {
    background: #38a169;
    transform: scale(1.05);
  }
  
  .admin-btn {
    background: #68d391;
    color: white;
  }
  
  .admin-btn:hover {
    background: #48bb78;
    transform: scale(1.05);
  }
  </style>
  