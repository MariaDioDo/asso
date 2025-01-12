import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axios from 'axios';

const store = createStore({
  state: {
    user: null,
    isAuthenticated: false,
    userType: null, // Para almacenar el tipo de usuario
    events: []  // Agregar el estado para los eventos
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
    getUserType: (state) => state.userType, // Getter para obtener el tipo de usuario
    getEvents: (state) => state.events, // Getter para obtener los eventos
  },
  mutations: {
    setUser(state, { user, userType }) {
      state.user = user;
      state.isAuthenticated = !!user;
      state.userType = userType;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.userType = null;
    },
    setEvents(state, events) {
      state.events = events;  // Mutación para guardar los eventos
    },
  },
  actions: {
    login({ commit }, { user, userType }) {
      commit('setUser', { user, userType });
    },
    logout({ commit }) {
      commit('logout');
      localStorage.removeItem('user');
    },
    async fetchEvents({ commit }) {
      try {
        // Aquí podrías obtener los eventos desde una API
        const response = await axios.get('http://localhost:5000/events');
        commit('setEvents', response.data);  // Guardamos los eventos en el store
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
      }
    },
    async updateUser({ commit }, updatedUser) {
      try {
        const response = await axios.put(`http://localhost:5000/usuarios/${updatedUser.id}`, updatedUser);
        commit('setUser', { user: response.data, userType: 'Usuario' }); // Actualiza como usuario
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error al actualizar los datos del usuario:', error);
        alert('Hubo un error al actualizar tus datos. Por favor, intenta de nuevo.');
      }
    },

    // Esta acción debe ir dentro de actions
    async updateUserAdmin({ commit }, updatedUserAdmin) {
      try {
        const response = await axios.put(`http://localhost:5000/administradores/${updatedUserAdmin.id}`, updatedUserAdmin);
        commit('setUser', { user: response.data, userType: 'Administrador' }); // Actualiza como administrador
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error al actualizar los datos del administrador:', error);
        alert('Hubo un error al actualizar los datos del administrador. Por favor, intenta de nuevo.');
      }
    },

  },
  plugins: [
    createPersistedState({
      paths: ['user', 'isAuthenticated', 'userType'], // Guarda también el tipo de usuario
    }),
  ],
});

export default store;
