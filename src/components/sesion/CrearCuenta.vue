<template>
  <div class="auth-container">
    <h1>Crear Cuenta</h1>
    <form @submit.prevent="register" class="auth-form">
      <!-- Campos iniciales -->
      <div class="form-group">
        <label for="username">Nombre de usuario:</label>
        <input type="text" id="username" v-model="formData.username" required />
        <p v-if="errors.username" class="error-message">{{ errors.username }}</p>
      </div>
      <div class="form-group">
        <label for="lastName">Apellido Paterno:</label>
        <input type="text" id="lastName" v-model="formData.lastName" required />
        <p v-if="errors.lastName" class="error-message">{{ errors.lastName }}</p>
      </div>
      <div class="form-group">
        <label for="secondLastName">Apellido Materno:</label>
        <input type="text" id="secondLastName" v-model="formData.secondLastName" required />
        <p v-if="errors.secondLastName" class="error-message">{{ errors.secondLastName }}</p>
      </div>
      <div class="form-group">
        <label for="email">Correo electrónico:</label>
        <input type="email" id="email" v-model="formData.email" required />
        <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="formData.password" required />
        <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
      </div>
      <div class="form-group">
        <label for="accountNumber">Número de cuenta:</label>
        <input type="text" id="accountNumber" v-model="formData.accountNumber" required />
        <p v-if="errors.accountNumber" class="error-message">{{ errors.accountNumber }}</p>
      </div>
      <div class="form-group">
        <label for="phone">Teléfono:</label>
        <input type="text" id="phone" v-model="formData.phone" required />
        <p v-if="errors.phone" class="error-message">{{ errors.phone }}</p>
      </div>


      <!-- Campo para Tipo de Persona -->
      <div class="form-group">
        <label for="personType">Tipo de Persona:</label>
        <select id="personType" v-model="formData.personType" required>
          <option v-for="type in personTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="degree">Licenciatura:</label>
        <select id="degree" v-model="formData.degree" required>
          <option v-for="degree in degrees" :key="degree" :value="degree">{{ degree }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="bloodType">Tipo de Sangre:</label>
        <select id="bloodType" v-model="formData.bloodType" required>
          <option v-for="type in bloodTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="nss">NSS:</label>
        <input type="text" id="nss" v-model="formData.nss" required />
        <p v-if="errors.nss" class="error-message">{{ errors.nss }}</p>
      </div>

      <!-- Campo de alergias -->
      <div class="form-group">
        <label for="allergies">Alergias:</label>
        <textarea id="allergies" v-model="formData.allergies" rows="4"></textarea>
        <p v-if="errors.allergies" class="error-message">{{ errors.allergies }}</p>
      </div>

      <button type="submit" class="btn-create" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="spinner"></span> Crear Cuenta
      </button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
    <p class="login-link">
      ¿Ya tienes una cuenta? <router-link to="/login">Iniciar Sesión</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      formData: {
        username: "",
        lastName: "",
        secondLastName: "",
        degree: "",
        personType: "",
        bloodType: "",
        email: "",
        password: "",
        accountNumber: "",
        allergies: "",
        phone: "",
        nss: "",
      },
      errors: {},
      degrees: ["ICO", "IEL", "IME", "ICI", "ISES", "IIA"],
      personTypes: ["Estudiante", "Profesor", "Academico"],
      bloodTypes: ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"],
      isSubmitting: false,
      errorMessage: "",
    };
  },
  methods: {
    async validateForm() {
      let isValid = true;
      this.errors = {};
      console.log('Validando el formulario...');

      // Validar nombre de usuario (solo letras)
      const lettersRegex = /^[A-Za-z\s]+$/;
      if (!this.formData.username) {
        this.errors.username = "El nombre de usuario es obligatorio.";
        isValid = false;
      } else if (!lettersRegex.test(this.formData.username)) {
        this.errors.username = "El nombre de usuario solo debe contener letras.";
        isValid = false;
      }

      // Validar apellidos (solo letras)
      if (!this.formData.lastName) {
        this.errors.lastName = "El apellido paterno es obligatorio.";
        isValid = false;
      } else if (!lettersRegex.test(this.formData.lastName)) {
        this.errors.lastName = "El apellido paterno solo debe contener letras.";
        isValid = false;
      }
      if (!this.formData.secondLastName) {
        this.errors.secondLastName = "El apellido materno es obligatorio.";
        isValid = false;
      } else if (!lettersRegex.test(this.formData.secondLastName)) {
        this.errors.secondLastName = "El apellido materno solo debe contener letras.";
        isValid = false;
      }

      // Validar correo electrónico
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!this.formData.email) {
        this.errors.email = "El correo electrónico es obligatorio.";
        isValid = false;
      } else if (!emailRegex.test(this.formData.email)) {
        this.errors.email = "El correo electrónico debe tener un formato válido (ejemplo@dominio.com).";
        isValid = false;
      } else if (await this.checkEmail(this.formData.email)) {
        this.errors.email = "El correo electronico ya está en uso.";
        isValid = false;
      }

      // Validación teléfono
      const phoneRegex = /^\d{10}$/;
      if (!this.formData.phone || !phoneRegex.test(this.formData.phone)) {
        this.errors.phone = "El número de teléfono debe contener 10 dígitos numéricos.";
        isValid = false;
      }

      // Validación NSS
      const nssRegex = /^\d{11}$/;
      if (!this.formData.nss || !nssRegex.test(this.formData.nss)) {
        this.errors.nss = "El NSS debe contener 11 dígitos.";
        isValid = false;
      } else if (await this.checkNSS(this.formData.nss)) {
        this.errors.nss = "El NSS ya está en uso.";
        isValid = false;
      }


      // Validar contraseña
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!this.formData.password) {
        this.errors.password = "La contraseña es obligatoria.";
        isValid = false;
      } else if (!passwordRegex.test(this.formData.password)) {
        this.errors.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.";
        isValid = false;
      }

      // Validar número de cuenta (7 dígitos numéricos)
      const accountNumberRegex = /^\d{7}$/;
      if (!this.formData.accountNumber) {
        this.errors.accountNumber = "El número de cuenta es obligatorio.";
        isValid = false;
      } else if (!accountNumberRegex.test(this.formData.accountNumber)) {
        this.errors.accountNumber = "El número de cuenta debe tener exactamente 7 dígitos.";
        isValid = false;
      } else if (await this.checkAccountNumber(this.formData.accountNumber)) {
        this.errors.accountNumber = "El número de cuenta ya está en uso.";
        isValid = false;
      }

      // Validar alergias (opcional, pero solo letras si se ingresa)
      if (this.formData.allergies && !lettersRegex.test(this.formData.allergies)) {
        this.errors.allergies = "Las alergias deben contener solo letras.";
        isValid = false;
      }
      console.log(this.errors);  // Verifica los errores generados

      return isValid;
    },

    async register() {
      const isValid = await this.validateForm();
      console.log("Formulario es válido:", isValid);  
      if (!isValid) return;

      this.isSubmitting = true;
      this.errorMessage = "";

      try {
        const response = await axios.post("http://localhost:5000/usuarios", this.formData);
        alert("Cuenta creada exitosamente.");
        console.log("Datos de la respuesta:", response.data); 
        this.$router.push("/login");
      } catch (error) {
        console.error("Error al crear cuenta:", error);
        this.errorMessage = "Ocurrió un error al registrar la cuenta.";
      } finally {
        this.isSubmitting = false;
      }
    },

    async checkAccountNumber(accountNumber) {
      try {
        // Aquí se obtiene directamente la respuesta sin asignar a 'response'
        const { data } = await axios.get(`http://localhost:5000/usuarios?accountNumber=${accountNumber}`);

        if (data.length > 0) {
          // Si la cuenta ya está en uso, retornar true
          return true;
        }

        return false; // Si no, retornar false
      } catch (error) {
        console.error("Error al verificar el número de cuenta:", error);
        this.errorMessage = "Error al verificar el número de cuenta. Intenta más tarde.";
        return false; // En caso de error, también retornamos false
      }
    },
    async checkEmail(email) {
      try {
        const { data } = await axios.get(`http://localhost:5000/usuarios?email=${email}`);
        if (data.length > 0) {
          // Si la cuenta ya está en uso, retornar true
          return true;
        }
        return false; // Si no, retornar false

      } catch (error) {
        console.error("Error al verificar el correo electrónico:", error);
        this.errorMessage = "Error al verificar el correo electrónico. Intenta más tarde.";
        return false;
      }
    },

    async checkNSS(nss) {
      try {
        const { data } = await axios.get(`http://localhost:5000/usuarios?nss=${nss}`);
        if (data.length > 0) {
          // Si la cuenta ya está en uso, retornar true
          return true;
        }
        return false; // Si no, retornar false

      } catch (error) {
        console.error("Error al verificar el NSS:", error);
        this.errorMessage = "Error al verificar el NSS. Intenta más tarde.";
        return false;
      }
    },
  },
};
</script>


<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 20vh;
  background-color: #f4f7fc;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.auth-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  font-size: 1rem;
  color: #555;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 4px;
  border: 1px solid #cccccc;
  font-size: 1rem;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

button.btn-create {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.btn-create:hover {
  background-color: #45a049;
}

.login-link {
  margin-top: 15px;
  text-align: center;
}

.login-link router-link {
  color: #4CAF50;
  font-weight: bold;
  text-decoration: none;
}

.login-link router-link:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
}

select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 4px;
  border: 1px solid #cccccc;
  font-size: 1rem;
  background-color: #d4edda;
  color: #155724;
}

select:focus {
  outline: none;
  border: 1px solid #28a745;
}

option {
  background-color: #d4edda;
  color: #155724;
}

select option:hover {
  background-color: #c3e6cb;
}

.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
