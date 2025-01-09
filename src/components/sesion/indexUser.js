import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axios from 'axios';

const store = createStore({
  state: {
    user: null,
    isAuthenticated: false,
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('logout');
      localStorage.removeItem('user');
    },
    async updateUser({ commit }, updatedUser) {
      try {
        const response = await axios.put(`http://localhost:5000/usuarios/${updatedUser.id}`, updatedUser);
        commit('setUser', response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error al actualizar los datos del usuario:', error);
        alert('Hubo un error al actualizar tus datos. Por favor, intenta de nuevo.');
      }
    },
  },
  plugins: [
    createPersistedState({
      paths: ['user', 'isAuthenticated'],
    }),
  ],
});

export default store;
